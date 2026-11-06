import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  ExternalLink,
  Camera,
  Plus,
  Check,
  X,
  FileText,
  Download,
  Upload,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import formatUpdater from '../utils/DateFormatter';
import CvBuilder from "../components/cv/CvBuilder";
import { getSavedCvMeta, pickCvUrl, setSavedCvMeta } from "../utils/cvStorage";
import { parseCvUpload } from "../utils/parseCvUpload";
import { parseTechTags } from "../utils/parseJsonField";
import { isValidEmail } from "../utils/validation";
import { assertImageFile, assertPdfFile } from "../utils/fileUpload";
import { isSafeHttpUrl } from "../utils/safeUrl";
import MarkdownDescription from "../components/offers/MarkdownDescription";
import MarkdownCheatsheet from "../components/MarkdownCheatsheet";
import NotFound from "./NotFound";

const Profile = () => {
  const { id } = useParams();
  const { user: loggedInUser, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isCvOpen, setIsCvOpen] = useState(false);
  const [descriptionTab, setDescriptionTab] = useState("edit");
  const [savedCv, setSavedCv] = useState(null);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({ email: "", phone: "", description: "" });
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const cvUploadInputRef = useRef(null);
  const cvMenuRef = useRef(null);

  const isOwner = loggedInUser && String(loggedInUser.id) === String(id);
  const isAdmin = loggedInUser && String(loggedInUser.role).toLowerCase() === "admin";

  const isEmailValid = isValidEmail(editForm.email);
  const isPhoneValid =
    !editForm.phone.trim() ||
    /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/.test(editForm.phone);
  const canSave =
    isEmailValid &&
    isPhoneValid &&
    editForm.description.length <= 255 &&
    !isSubmitting;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, offersRes] = await Promise.all([
        api.get(`/profile/getProfile/${id}`),
        api.get(`/offer/user/${id}`),
      ]);

      if (profileRes.data.message && profileRes.data.message.length > 0) {
        const userData = profileRes.data.message[0];
        setProfile(userData);
        setEditForm({
          email: userData.email,
          phone: userData.phone || "",
          description: userData.description || "",
        });
        const fromProfile = pickCvUrl(userData);
        const fromLocal = getSavedCvMeta(id);
        const url = fromProfile || fromLocal?.url || "";
        if (url || fromLocal) {
          const meta = { url, savedAt: fromLocal?.savedAt || Date.now() };
          setSavedCv(meta);
          if (url) setSavedCvMeta(id, meta);
        } else {
          setSavedCv(null);
        }
      }

      const offersData = offersRes.data.message;
      setOffers(Array.isArray(offersData) ? offersData : []);
    } catch (error) {
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    const closeCvMenu = (event) => {
      if (!cvMenuRef.current?.contains(event.target)) {
        cvMenuRef.current.open = false;
      }
    };

    document.addEventListener("pointerdown", closeCvMenu);
    return () => {
      document.removeEventListener("pointerdown", closeCvMenu);
    };
  }, []);

const handleUpdateProfile = async () => {
    if (!canSave) return;
    setIsSubmitting(true);
    try {
      const res = isAdmin && !isOwner ? 
        await api.patch(`/admin/update/user/${id}`, editForm)
        : await api.patch(`/edit/user/${id}`, editForm)
      
      const updated = {
        ...profile,
        email: editForm.email,
        phone: editForm.phone,
        description: editForm.description.trim() || null,
      };
      setProfile(updated); 
      if (isOwner) {
        const userToUpdate = {
          ...loggedInUser,
          email: editForm.email,
          phone: editForm.phone,
          description: editForm.description.trim() || null,
        };
        setUser(userToUpdate);
      }
      setIsEditing(false);
      toast.success(res.data.message || "Profil zaktualizowany");
    } catch (e) {
      toast.error(e.response?.data?.message || "Błąd zapisu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    const invalid = assertImageFile(file);
    if (invalid) {
      toast.error(invalid);
      return;
    }
    const data = new FormData();
    data.append("profilePhoto", file);
    const uploadToast = toast.loading("Wgrywanie...");
    try {
      await api.post("/upload/profilePhoto", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const usersRes = await api.get(`/profile/getProfile/${id}`);
      const updatedMe = usersRes.data.message && usersRes.data.message[0];
      if (updatedMe) {
        setUser(updatedMe);
        setProfile(updatedMe);
        toast.success("Zdjęcie zmienione", { id: uploadToast });
      }
    } catch (error) {
      toast.error("Błąd", { id: uploadToast });
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    try {
      const parsed = await parseCvUpload(file);
      if (parsed) {
        setEditForm({
          ...editForm,
          email: parsed.email || editForm.email,
          phone: parsed.phone || editForm.phone,
        });
        toast.success("Dane z CV zostały wczytane");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Błąd przetwarzania CV");
    }
  };

  const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    const invalid = assertPdfFile(file);
    if (invalid) {
      toast.error(invalid);
      return;
    }

    const data = new FormData();
    data.append("cvFile", file);
    setIsUploadingCv(true);
    const uploadToast = toast.loading("Wgrywanie CV...");

    try {
      const response = await api.post("/upload/uploadcv", data);
      const cvUrl = response.data?.cvUrl;
      if (!cvUrl) {
        throw new Error("Serwer nie zwrócił adresu wgranego CV");
      }

      const meta = {
        url: response.data?.cvUrlDowload || cvUrl,
        savedAt: Date.now(),
      };
      setSavedCvMeta(id, meta);
      setSavedCv(meta);
      setProfile((currentProfile) => ({ ...currentProfile, cv_url: cvUrl }));
      if (isOwner) {
        setUser({ ...loggedInUser, cv_url: cvUrl });
      }
      toast.success(response.data?.message || "CV zapisane na profilu", {
        id: uploadToast,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Nie udało się wgrać CV",
        { id: uploadToast },
      );
    } finally {
      setIsUploadingCv(false);
    }
  };

  const handleCvSaved = (meta) => {
    setSavedCv(meta);
    if (isOwner && meta?.url) {
      setUser({ ...loggedInUser, cv_url: meta.url });
      setProfile((currentProfile) => ({ ...currentProfile, cv_url: meta.url }));
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 font-black uppercase italic tracking-widest text-zinc-900">
        Ładowanie...
      </div>
    );

  if (!profile)
    return (
      <NotFound
        title="Nie ma takiego użytkownika"
        description="Profil nie istnieje albo został usunięty."
      />
    );

  return (
    <div className="text-zinc-950 pb-24 relative z-10 overflow-x-hidden">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
      <input type="file" ref={pdfInputRef} className="hidden" accept=".pdf" onChange={handlePdfUpload} />
      <input type="file" ref={cvUploadInputRef} className="hidden" accept="application/pdf,.pdf" onChange={handleCvUpload} />

      <div className="relative h-48 bg-white/10 border-b border-zinc-200 backdrop-blur-sm">
        <div className="absolute -bottom-16 left-6 md:left-16 lg:left-32">
          <div className="relative group">
            {profile.photo ? (
              <img src={profile.photo} className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover border-4 border-white shadow-xl bg-white" alt="" />
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-white shadow-xl bg-white flex items-center justify-center">
                <User className="w-20 h-20 text-zinc-300" />
              </div>
            )}
            {isOwner && (
              <div
                onClick={() => !isSubmitting && fileInputRef.current.click()}
                className={`absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <Camera className="text-white w-8 h-8" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-20 px-6 md:px-16 lg:px-32 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight uppercase italic text-zinc-900 break-words">
              {profile.name} {profile.surname}
            </h1>
            <div className="flex flex-wrap gap-4 mt-3 text-zinc-700 font-bold">
              <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-lg border border-zinc-200 shadow-sm">
                <Mail className={`w-4 h-4 shrink-0 ${isEditing && !isEmailValid ? 'text-red-500' : 'text-zinc-400'}`} />
                {isEditing ? (
                  <input 
                    disabled={isSubmitting}
                    className="bg-transparent outline-none border-b border-zinc-300 focus:border-zinc-900 w-full min-w-0 sm:min-w-[180px]"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                ) : profile.email}
              </div>
              <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-lg border border-zinc-200 shadow-sm">
                <Phone className={`w-4 h-4 shrink-0 ${isEditing && !isPhoneValid ? 'text-red-500' : 'text-zinc-400'}`} />
                {isEditing ? (
                  <input 
                    disabled={isSubmitting}
                    className="bg-transparent outline-none border-b border-zinc-300 focus:border-zinc-900 w-full min-w-0 sm:min-w-[120px]"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                ) : profile.phone || "Brak numeru"}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto md:justify-end">
          {(isOwner || isAdmin) && (
              <>
              {isEditing ? (
                <>
                  <button 
                    onClick={handleUpdateProfile} 
                    disabled={!canSave}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-colors shadow-sm ${canSave ? 'bg-zinc-950 text-white hover:bg-zinc-800 cursor-pointer' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
                  >
                    {isSubmitting ? "Czekaj..." : <><Check className="w-5 h-5" /> Zapisz</>}
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        email: profile.email,
                        phone: profile.phone || "",
                        description: profile.description || "",
                      });
                    }}
                    disabled={isSubmitting} 
                    className={`flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 px-4 py-2.5 rounded-xl font-bold transition-colors shadow-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-50 cursor-pointer'}`}
                  >
                    <X className="w-4 h-4" /> Anuluj
                  </button>
                  <button 
                    onClick={() => pdfInputRef.current.click()}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 font-bold text-violet-800 shadow-sm transition-colors hover:bg-violet-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FileText className="w-4 h-4" /> Uzupełnij dane z CV
                  </button>
                </>
              ) : (
                <>
                  {isOwner && (
                    <details ref={cvMenuRef} className="relative">
                      <summary className="flex list-none cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 font-bold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 [&::-webkit-details-marker]:hidden">
                        <FileText className="h-5 w-5 shrink-0" />
                        CV
                        <ChevronDown className="h-4 w-4 text-zinc-500" />
                      </summary>
                      <div className="absolute right-0 top-full z-30 mt-2 flex w-56 flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.currentTarget.closest("details").open = false;
                            setIsCvOpen(true);
                          }}
                          className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
                        >
                          <FileText className="h-4 w-4 text-zinc-500" />
                          Stwórz CV
                        </button>
                        <button
                          type="button"
                          disabled={isUploadingCv}
                          onClick={(event) => {
                            event.currentTarget.closest("details").open = false;
                            cvUploadInputRef.current?.click();
                          }}
                          className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Upload className="h-4 w-4 text-zinc-500" />
                          {isUploadingCv
                            ? "Wgrywanie..."
                            : savedCv
                              ? "Zmień plik PDF"
                              : "Wgraj plik PDF"}
                        </button>
                      </div>
                    </details>
                  )}
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex cursor-pointer items-center justify-center rounded-xl bg-zinc-950 px-4 py-2.5 font-bold text-white shadow-sm transition-colors hover:bg-zinc-800"
                  >
                    Edytuj profil
                  </button>
                </>
              )}
              </>
          )}
          </div>
        </div>

        <nav aria-label="Sekcje profilu" className="flex flex-wrap gap-2 mt-8">
          <a
            href="#profile-description"
            className="px-4 py-2 rounded-full border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 hover:border-zinc-400 hover:text-zinc-950 transition-colors"
          >
            Opis
          </a>
          <a
            href="#profile-offers"
            className="px-4 py-2 rounded-full border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 hover:border-zinc-400 hover:text-zinc-950 transition-colors"
          >
            Oferty ({offers.length})
          </a>
          {savedCv && !isEditing && (
            <a
              href={isSafeHttpUrl(savedCv.url) ? savedCv.url : undefined}
              onClick={(e) => {
                if (isSafeHttpUrl(savedCv.url)) return;
                e.preventDefault();
                if (isOwner) setIsCvOpen(true);
                else toast.error("CV nie ma jeszcze publicznego linku");
              }}
              target={isSafeHttpUrl(savedCv.url) ? "_blank" : undefined}
              rel={isSafeHttpUrl(savedCv.url) ? "noreferrer" : undefined}
              className="flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800"
            >
              <Download className="h-4 w-4 shrink-0" />
              Pobierz CV
            </a>
          )}
        </nav>

        <div className="h-px bg-zinc-200 my-8 w-full"></div>

        <section id="profile-description" className="scroll-mt-8 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-bold text-zinc-900">O mnie</h2>
            {isEditing && (
              <span
                className={`text-xs font-medium ${editForm.description.length > 255 ? "text-red-600" : "text-zinc-500"}`}
              >
                {editForm.description.length}/255
              </span>
            )}
          </div>
          {isEditing ? (
            <>
              <div className="mb-3 inline-flex rounded-lg bg-zinc-100 p-1" role="tablist" aria-label="Tryb edycji opisu profilu">
                {[
                  ["edit", "Edytuj"],
                  ["preview", "Podgląd"],
                ].map(([tab, label]) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={descriptionTab === tab}
                    onClick={() => setDescriptionTab(tab)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      descriptionTab === tab
                        ? "bg-white text-zinc-950 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {descriptionTab === "edit" ? (
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  maxLength={255}
                  disabled={isSubmitting}
                  rows={4}
                  placeholder="Napisz kilka zdań o sobie..."
                  aria-label="Opis profilu"
                  className="w-full resize-y rounded-2xl border border-zinc-200 bg-white p-4 text-sm leading-relaxed text-zinc-800 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 disabled:opacity-60"
                />
              ) : (
                <div
                  role="tabpanel"
                  className="prose prose-sm prose-zinc min-h-28 max-w-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-6 prose-p:my-3 prose-li:my-0 prose-a:text-blue-700 prose-img:my-4 prose-img:max-h-64 prose-img:rounded-xl"
                >
                  {editForm.description.trim() ? (
                    <MarkdownDescription>{editForm.description}</MarkdownDescription>
                  ) : (
                    <p className="m-0 text-zinc-400">Podgląd formatowania pojawi się tutaj.</p>
                  )}
                </div>
              )}
              <MarkdownCheatsheet />
            </>
          ) : (
            profile.description ? (
              <div className="prose prose-sm prose-zinc max-w-4xl leading-relaxed prose-p:my-3 prose-li:my-0 prose-a:text-blue-700 prose-img:my-4 prose-img:max-h-64 prose-img:rounded-xl">
                <MarkdownDescription>{profile.description}</MarkdownDescription>
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-zinc-500">Brak opisu.</p>
            )
          )}
        </section>

        <section id="profile-offers" className="scroll-mt-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-zinc-400" />
              <h2 className="text-2xl font-black uppercase tracking-tighter italic text-zinc-800 underline decoration-zinc-300 underline-offset-8">
                Oferty ({offers.length})
              </h2>
            </div>
            {isOwner && (
              <Link
                className="flex items-center gap-2 bg-zinc-100 border border-zinc-200 text-zinc-900 px-4 py-2 rounded-xl font-bold hover:bg-white transition-all shadow-sm uppercase text-xs cursor-pointer"
                to={`/CreateOffer`}
              >
                <Plus className="w-4 h-4" />Dodaj ogłoszenie
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.length > 0 ? (
              offers.map((offer) => {
                const techTags = parseTechTags(offer.tech);

                return (
                  <div key={offer.id} className="group bg-white/60 backdrop-blur-md border border-zinc-200 p-6 rounded-2xl hover:border-zinc-400 hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-zinc-900 leading-tight">
                          <Link className="cursor-pointer" to={`/offer/${offer.id}`}>{offer.title}</Link>
                        </h3>
                        <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mt-1">{offer.company}</p>
                      </div>
                      <Link className="cursor-pointer" to={`/offer/${offer.id}`}>
                        <ExternalLink className="w-5 h-5 text-zinc-300 group-hover:text-zinc-950 transition-colors" />
                      </Link>
                    </div>
                    <p className="text-zinc-700 text-sm leading-relaxed mb-6 line-clamp-3 font-semibold">{offer.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(techTags) && techTags.map((t, idx) => (
                        <span key={idx} className="text-[9px] font-black bg-white border border-zinc-200 px-2.5 py-1 rounded-md uppercase text-zinc-600 shadow-sm antialiased">{t}</span>
                      ))}
                    </div>
                    {offer.updated && (
                      <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2 text-[10px] text-zinc-400 font-black uppercase tracking-widest">
                        <Calendar className="w-3 h-3" /> {formatUpdater(offer.updated)}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-20 bg-white/40 border-2 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center text-zinc-400">
                <p className="font-black uppercase tracking-[0.2em] text-xs">Brak ogłoszeń</p>
              </div>
            )}
          </div>
        </section>
      </div>
      {isCvOpen && (
        <CvBuilder
          profile={profile}
          onClose={() => setIsCvOpen(false)}
          onSaved={handleCvSaved}
        />
      )}
    </div>
  );
};

export default Profile;