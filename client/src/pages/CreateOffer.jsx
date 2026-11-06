import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';
import api from "../api/client";
import MarkdownDescription from "../components/offers/MarkdownDescription";
import { parseLinks, parseTechTags } from "../utils/parseJsonField";
import { isSafeHttpUrl } from "../utils/safeUrl";
import { ArrowUpRight, Briefcase, Github, Linkedin, Mail, Phone, User } from "lucide-react";

const AddOfferForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [descriptionTab, setDescriptionTab] = useState("edit");
  const [contact, setContact] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    name: user?.name || '',
    surname: user?.surname || '',
    photo: user?.photo || '',
    userId: user?.id || ''
  });
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    tech: '',
    github: '',
    linkedin: ''
  });

  useEffect(() => {
    let isCurrent = true;

    const loadFormData = async () => {
      try {
        if (isEdit) {
          const res = await api.get(`/offer/getOffer/${id}`);
          const data = res.data.message[0];
          if (!isCurrent || !data) return;

          const techArr = parseTechTags(data.tech);
          const linksObj = parseLinks(data.links);
          setFormData({
            title: data.title || '',
            company: data.company || '',
            description: data.description || '',
            tech: Array.isArray(techArr) ? techArr.join(', ') : '',
            github: linksObj?.Github || '',
            linkedin: linksObj?.Linkedin || ''
          });
          setContact({
            email: data.email || '',
            phone: data.phone || '',
            name: data.name || '',
            surname: data.surname || '',
            photo: data.photo || '',
            userId: data.user_id || ''
          });
        } else if (user?.id) {
          const res = await api.get(`/profile/getProfile/${user.id}`);
          const profile = res.data.message?.[0];
          if (!isCurrent || !profile) return;
          setContact({
            email: profile.email || '',
            phone: profile.phone || '',
            name: profile.name || '',
            surname: profile.surname || '',
            photo: profile.photo || '',
            userId: profile.id || user.id
          });
        }
      } catch {
        if (isCurrent) {
          toast.error(isEdit
            ? "Nie udało się pobrać danych ogłoszenia"
            : "Nie udało się pobrać danych kontaktowych z profilu");
        }
      }
    };

    loadFormData();
    return () => {
      isCurrent = false;
    };
  }, [id, isEdit, user?.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async () => {
    if (!window.confirm("Czy na pewno chcesz usunąć to ogłoszenie?")) return;

    setIsDeleting(true);
    try {
      const isAdmin = String(user?.role || "").toLowerCase() === "admin";
      const url = isAdmin
        ? `/admin/remove/offer/${id}`
        : `/offers/deleteOffer/${id}`;
      await api.delete(url);
      toast.success("Ogłoszenie zostało usunięte");
      navigate(isAdmin ? "/admin" : `/profile/${user?.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Błąd podczas usuwania");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      toast.error("Dodaj opis stanowiska");
      setDescriptionTab("edit");
      return;
    }
    setLoading(true);

    const github = formData.github.trim();
    const linkedin = formData.linkedin.trim();
    if (github && !isSafeHttpUrl(github)) {
      toast.error("Link GitHub musi zaczynać się od http:// lub https://");
      setLoading(false);
      return;
    }
    if (linkedin && !isSafeHttpUrl(linkedin)) {
      toast.error("Link LinkedIn musi zaczynać się od http:// lub https://");
      setLoading(false);
      return;
    }

    const linksObj = {};
    if (github) linksObj.Github = github;
    if (linkedin) linksObj.Linkedin = linkedin;

    const payload = {
      id: id,
      title: formData.title,
      company: formData.company || "", 
      description: formData.description,
      tech: JSON.stringify(formData.tech.split(',').map(item => item.trim()).filter(i => i !== "")),
      links: JSON.stringify(linksObj)
    };

    try {
      if (isEdit) {
        const isAdmin = user && String(user.role).toLowerCase() === "admin";
        const url = isAdmin ? `/admin/update/offer/${id}` : `/offers/editOffer/${id}`;
        await api.patch(url, payload);
        
        toast.success("Ogłoszenie zaktualizowane!");
        navigate(`/offer/${id}`);
      } else {
        await api.post("/addOffer", payload);
        
        toast.success("Ogłoszenie opublikowane!");
        navigate(`/profile/${user?.id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Wystąpił błąd podczas zapisu");
    } finally {
      setLoading(false);
    }
  };

  const techTags = formData.tech
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 font-sans antialiased text-zinc-950 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {isEdit ? "Edytuj ogłoszenie" : "Stwórz ogłoszenie"}
            </h1>
          </div>
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || loading}
              className="shrink-0 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 cursor-pointer"
            >
              {isDeleting ? "Usuwanie..." : "Usuń ofertę"}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm lg:col-span-8">
            <div className="flex items-center gap-4 border-b border-zinc-100 px-5 py-5 sm:px-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-100">
                {contact.photo ? (
                  <img src={contact.photo} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User size={22} className="text-zinc-500" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">
                  {[contact.name, contact.surname].filter(Boolean).join(' ') || "Twoje konto"}
                </p>
                <p className="text-xs text-zinc-500">Publikujesz jako autor ogłoszenia</p>
              </div>
            </div>

            <div className="space-y-7 p-5 sm:p-8">
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-zinc-500">Tytuł ogłoszenia</span>
                  <input
                    name="title"
                    value={formData.title}
                    placeholder="Np. Frontend Developer"
                    maxLength={40}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-lg font-bold tracking-tight outline-none transition focus:border-zinc-500"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-zinc-500">Firma</span>
                  <div className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 focus-within:border-zinc-500">
                    <Briefcase size={17} className="shrink-0 text-zinc-400" />
                    <input
                      name="company"
                      value={formData.company}
                      placeholder="Nazwa firmy (opcjonalnie)"
                      maxLength={40}
                      onChange={handleChange}
                      className="w-full bg-transparent py-3 text-sm outline-none"
                    />
                  </div>
                </label>
              </div>

              <div className="space-y-4 border-t border-zinc-100 pt-6">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold">Stack technologiczny</span>
                  <input
                    name="tech"
                    value={formData.tech}
                    placeholder="Dodaj technologie, oddzielając je przecinkami"
                    onChange={handleChange}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
                  />
                </label>
                {techTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {techTags.map((tag, index) => (
                      <span key={`${tag}-${index}`} className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    name="github"
                    value={formData.github}
                    placeholder="Link GitHub"
                    onChange={handleChange}
                    aria-label="Link GitHub"
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
                  />
                  <input
                    name="linkedin"
                    value={formData.linkedin}
                    placeholder="Link LinkedIn"
                    onChange={handleChange}
                    aria-label="Link LinkedIn"
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
                  />
                </div>
              </div>

              <section className="border-t border-zinc-100 pt-6">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-sm font-bold">Opis stanowiska</h2>
                  <div className="inline-flex rounded-lg bg-zinc-100 p-1" role="tablist" aria-label="Tryb edycji opisu">
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
                </div>
                {descriptionTab === "edit" ? (
                  <textarea
                    name="description"
                    value={formData.description}
                    placeholder="Opowiedz o projekcie, zakresie obowiązków i tym, kogo szukasz..."
                    onChange={handleChange}
                    required
                    className="min-h-56 w-full resize-y rounded-xl border border-zinc-200 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500"
                  />
                ) : (
                  <div
                    role="tabpanel"
                    className="prose prose-sm prose-zinc min-h-56 max-w-none rounded-xl border border-zinc-200 px-4 py-3 text-sm leading-6 prose-p:my-3 prose-li:my-0 prose-a:text-blue-700 prose-img:my-4 prose-img:max-h-96 prose-img:rounded-xl"
                  >
                    {formData.description.trim() ? (
                      <MarkdownDescription>
                        {formData.description}
                      </MarkdownDescription>
                    ) : (
                      <p className="m-0 text-zinc-400">Podgląd formatowania pojawi się tutaj.</p>
                    )}
                  </div>
                )}
                <details className="group mt-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3">
                  <summary className="cursor-pointer list-none text-xs font-semibold text-zinc-600 marker:hidden">
                    <span className="group-open:hidden">Jak formatować tekst? Pokaż ściągawkę</span>
                    <span className="hidden group-open:inline">Ukryj ściągawkę formatowania</span>
                  </summary>
                  <div className="mt-3 grid gap-3 text-xs text-zinc-600 sm:grid-cols-2">
                    <div>
                      <p className="mb-1 font-bold text-zinc-800">Pogrubienie i kursywa</p>
                      <code className="block rounded bg-white px-2 py-1">**pogrubienie**</code>
                      <code className="mt-1 block rounded bg-white px-2 py-1">*kursywa*</code>
                    </div>
                    <div>
                      <p className="mb-1 font-bold text-zinc-800">Listy</p>
                      <code className="block whitespace-pre-wrap rounded bg-white px-2 py-1">- pierwszy punkt{"\n"}- drugi punkt</code>
                    </div>
                    <div>
                      <p className="mb-1 font-bold text-zinc-800">Link</p>
                      <code className="block break-all rounded bg-white px-2 py-1">[Zobacz stronę](https://example.com)</code>
                    </div>
                    <div>
                      <p className="mb-1 font-bold text-zinc-800">Zdjęcie</p>
                      <code className="block break-all rounded bg-white px-2 py-1">![Opis zdjęcia](https://...)</code>
                    </div>
                  </div>
                </details>
              </section>
            </div>
          </div>

          <aside className="space-y-4 lg:col-span-4">
            <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-sm font-bold">Dane kontaktowe</h2>
              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Te dane zobaczą osoby zainteresowane ofertą.
              </p>
              <div className="mt-5 space-y-4">
                <div className="flex min-w-0 items-start gap-3 text-sm">
                  <Mail size={17} className="mt-0.5 shrink-0 text-zinc-400" />
                  <span className="break-all text-zinc-700">{contact.email || "Brak adresu email"}</span>
                </div>
                <div className="flex min-w-0 items-start gap-3 text-sm">
                  <Phone size={17} className="mt-0.5 shrink-0 text-zinc-400" />
                  <span className="text-zinc-700">{contact.phone || "Nie podano numeru telefonu"}</span>
                </div>
                {[
                  { name: "GitHub", url: formData.github, Icon: Github },
                  { name: "LinkedIn", url: formData.linkedin, Icon: Linkedin },
                ]
                  .filter(({ url }) => isSafeHttpUrl(url))
                  .map((item) => (
                    <a
                      key={item.name}
                      href={item.url.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-w-0 items-center gap-3 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950"
                    >
                      <item.Icon size={17} className="mt-0.5 shrink-0 text-zinc-400" />
                      <span>{item.name}</span>
                      <ArrowUpRight size={14} className="ml-auto shrink-0 text-zinc-400" />
                    </a>
                  ))}
              </div>
              <p className="mt-5 border-t border-zinc-100 pt-4 text-xs leading-5 text-zinc-500">
                Email i numer telefonu zmienisz w edycji profilu.
              </p>
              {contact.userId && (
                <Link
                  to={`/profile/${contact.userId}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 hover:underline"
                >
                  Przejdź do profilu <ArrowUpRight size={14} />
                </Link>
              )}
            </section>

            <button
              type="submit"
              disabled={loading || isDeleting}
              className="w-full rounded-2xl bg-zinc-950 px-5 py-4 text-sm font-bold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400 cursor-pointer"
            >
              {loading ? "Przetwarzanie..." : (isEdit ? "Zapisz zmiany" : "Opublikuj ogłoszenie")}
            </button>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default AddOfferForm;