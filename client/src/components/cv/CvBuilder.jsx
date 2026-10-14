import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Camera, Download, FileText, Plus, Upload, User, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { buildCvPdfBlob, downloadCvPdf } from "../../utils/downloadCvPdf";
import { pickCvUrl, setSavedCvMeta } from "../../utils/cvStorage";
import CvPreview, { CV_TEMPLATES } from "./CvPreview";

const API_URL = import.meta.env.VITE_BACKEND_API_URL || "";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none transition-all text-sm";
const labelClass =
  "text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3";

const emptyJob = () => ({
  role: "",
  company: "",
  period: "",
  description: "",
});

const emptySchool = () => ({
  degree: "",
  school: "",
  period: "",
});

const emptyProject = () => ({
  name: "",
  tech: "",
  link: "",
  description: "",
});

const emptyCourse = () => ({
  name: "",
  issuer: "",
  year: "",
});

const buildInitialForm = (profile) => ({
  fullName: [profile?.name, profile?.surname].filter(Boolean).join(" "),
  title: "",
  email: profile?.email || "",
  phone: profile?.phone || "",
  location: "",
  website: "",
  github: "",
  linkedin: "",
  photo: profile?.photo || "",
  summary: "",
  availability: "",
  skills: "",
  experience: [emptyJob()],
  education: [emptySchool()],
  projects: [emptyProject()],
  courses: [emptyCourse()],
  languages: "",
  interests: "",
  template: "classic",
});

const PAGE_W = 794;
const PAGE_H = 1123;

const ScaledPreview = ({ form }) => {
  const boxRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(0.4);
  const [height, setHeight] = useState(PAGE_H * 0.4);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => {
      const nextScale = Math.min(1, el.clientWidth / PAGE_W);
      setScale(nextScale);
      const innerH = innerRef.current?.scrollHeight || PAGE_H;
      setHeight(innerH * nextScale);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [form]);

  return (
    <div ref={boxRef} className="w-full min-w-0">
      <div
        className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
        style={{ height }}
      >
        <div
          ref={innerRef}
          style={{
            width: PAGE_W,
            minHeight: PAGE_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <CvPreview form={form} />
        </div>
      </div>
    </div>
  );
};

const CvBuilder = ({ profile, onClose, onSaved }) => {
  const previewRef = useRef(null);
  const photoInputRef = useRef(null);
  const storageKey = `cv-draft-${profile?.id || "guest"}`;
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => {
    const initial = buildInitialForm(profile);
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return initial;
      const parsed = JSON.parse(saved);
      return {
        ...initial,
        ...parsed,
        experience: parsed.experience?.length ? parsed.experience : initial.experience,
        education: parsed.education?.length ? parsed.education : initial.education,
        projects: parsed.projects?.length ? parsed.projects : initial.projects,
        courses: parsed.courses?.length ? parsed.courses : initial.courses,
        photo: parsed.photo || initial.photo,
        template: parsed.template || initial.template,
      };
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(form));
    } catch {
      try {
        const { photo, ...rest } = form;
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            ...rest,
            photo: typeof photo === "string" && photo.startsWith("data:") ? "" : photo,
          }),
        );
      } catch {
        /* ignore quota */
      }
    }
  }, [form, storageKey]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateList = (key, index, field, value) => {
    setForm((prev) => {
      const next = [...prev[key]];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, [key]: next };
    });
  };

  const addItem = (key, factory) => {
    setForm((prev) => ({ ...prev, [key]: [...prev[key], factory()] }));
  };

  const removeItem = (key, index) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].length > 1 ? prev[key].filter((_, i) => i !== index) : prev[key],
    }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Wybierz plik graficzny");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updateField("photo", reader.result);
    reader.readAsDataURL(file);
  };

  const cvFilename = () => {
    const slug = form.fullName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-ąćęłńóśźż]/gi, "");
    return `CV-${slug || "maxhire"}.pdf`;
  };

  const handleDownload = async () => {
    if (!form.fullName.trim()) {
      toast.error("Podaj imię i nazwisko");
      return;
    }
    setDownloading(true);
    const toastId = toast.loading("Generowanie CV...");
    try {
      await downloadCvPdf(previewRef.current, cvFilename());
      toast.success("CV pobrane", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Nie udało się wygenerować PDF", { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  const handleSaveToProfile = async () => {
    if (!form.fullName.trim()) {
      toast.error("Podaj imię i nazwisko");
      return;
    }
    setSaving(true);
    const toastId = toast.loading("Zapisywanie CV na profil...");
    try {
      const blob = await buildCvPdfBlob(previewRef.current);
      const filename = cvFilename();
      const payload = { ...form };
      if (typeof payload.photo === "string" && payload.photo.startsWith("data:")) {
        payload.photo = profile?.photo || "";
      }
      const data = new FormData();
      data.append("cvFile", blob, filename);
      data.append("cvData", JSON.stringify(payload));
      data.append("userId", profile?.id || "");

      const response = await axios.post(`${API_URL}/backend/profile/cv`, data, {
        withCredentials: true,
      });
      const cvUrl = pickCvUrl(response.data);
      const meta = { url: cvUrl, savedAt: Date.now() };
      setSavedCvMeta(profile?.id, meta);
      onSaved?.(meta);
      toast.success(response.data?.message || "CV zapisane na profilu", {
        id: toastId,
      });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Nie udało się zapisać CV na backendzie",
        { id: toastId },
      );
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[80] bg-zinc-950/60 backdrop-blur-sm overflow-hidden">
      <div className="h-dvh w-full max-w-6xl mx-auto sm:p-4">
        <div className="h-full w-full min-w-0 bg-[#fcfcfc] sm:rounded-3xl border-0 sm:border border-zinc-200 shadow-2xl flex flex-col overflow-hidden">
          <div className="shrink-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 border-b border-zinc-200 bg-white">
            <div className="flex items-center justify-between gap-3 min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400 shrink-0" />
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-2xl font-black uppercase italic tracking-tighter text-zinc-900 truncate">
                    Stwórz CV
                  </h2>
                  <p className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Wpisz dane i pobierz dokument
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="sm:hidden flex items-center justify-center h-11 w-11 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900 cursor-pointer shrink-0"
                aria-label="Zamknij"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button
                type="button"
                onClick={handleSaveToProfile}
                disabled={downloading || saving}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-zinc-950 text-white px-4 sm:px-5 py-3 rounded-xl font-black uppercase tracking-tighter hover:bg-zinc-800 transition-all shadow-lg active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              >
                <Upload className="w-4 h-4 shrink-0" />
                {saving ? "Zapisywanie..." : "Zapisz na profil"}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading || saving}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-zinc-100 border border-zinc-200 text-zinc-900 px-4 sm:px-5 py-3 rounded-xl font-black uppercase tracking-tighter hover:bg-white transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              >
                <Download className="w-4 h-4 shrink-0" />
                {downloading ? "Generowanie..." : "Pobierz PDF"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="hidden sm:flex items-center gap-2 bg-zinc-100 border border-zinc-200 text-zinc-900 px-4 py-3 rounded-xl font-bold hover:bg-white transition-all uppercase text-xs cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" /> Zamknij
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 min-w-0 overflow-y-auto lg:overflow-hidden lg:grid lg:grid-cols-2">
            <form
              className="p-4 sm:p-6 md:p-8 space-y-8 border-b lg:border-b-0 lg:border-r border-zinc-200 lg:overflow-y-auto lg:h-full min-w-0"
              onSubmit={(e) => e.preventDefault()}
            >
              <section>
                <p className={labelClass}>Szablon CV</p>
                <div className="grid grid-cols-2 gap-2">
                  {CV_TEMPLATES.map((tpl) => {
                    const active = (form.template || "classic") === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => updateField("template", tpl.id)}
                        className={`text-left rounded-2xl border p-3 cursor-pointer transition-all ${
                          active
                            ? "border-zinc-950 bg-white shadow-sm"
                            : "border-zinc-200 bg-gray-50 hover:bg-white"
                        }`}
                      >
                        <span
                          className={`block h-2 w-10 rounded-full mb-2 ${tpl.swatch}`}
                        />
                        <span className="block text-xs font-black uppercase tracking-tighter">
                          {tpl.label}
                        </span>
                        <span className="block text-[10px] text-zinc-400 mt-0.5">
                          {tpl.hint}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section>
                <p className={labelClass}>Zdjęcie</p>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhoto}
                />
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-zinc-200 bg-white shrink-0 flex items-center justify-center">
                    {form.photo ? (
                      <img
                        src={form.photo}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-zinc-300" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 bg-zinc-950 text-white px-4 py-2.5 rounded-xl font-black uppercase tracking-tighter text-[10px] cursor-pointer hover:bg-zinc-800"
                    >
                      <Camera className="w-4 h-4" />{" "}
                      {form.photo ? "Zmień zdjęcie" : "Dodaj zdjęcie"}
                    </button>
                    {form.photo && (
                      <button
                        type="button"
                        onClick={() => updateField("photo", "")}
                        className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-500 cursor-pointer"
                      >
                        Usuń
                      </button>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <p className={labelClass}>Dane podstawowe</p>
                <div className="space-y-3">
                  <input
                    className={inputClass}
                    placeholder="Imię i nazwisko"
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                  />
                  <input
                    className={inputClass}
                    placeholder="Stanowisko / tytuł zawodowy"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                  />
                  <input
                    className={inputClass}
                    placeholder="Dostępność, np. B2B, od zaraz, 40h/tydz."
                    value={form.availability}
                    onChange={(e) => updateField("availability", e.target.value)}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      className={inputClass}
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                    <input
                      className={inputClass}
                      placeholder="Telefon"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                    />
                    <input
                      className={inputClass}
                      placeholder="Lokalizacja"
                      value={form.location}
                      onChange={(e) => updateField("location", e.target.value)}
                    />
                    <input
                      className={inputClass}
                      placeholder="Portfolio / strona"
                      value={form.website}
                      onChange={(e) => updateField("website", e.target.value)}
                    />
                    <input
                      className={inputClass}
                      placeholder="GitHub"
                      value={form.github}
                      onChange={(e) => updateField("github", e.target.value)}
                    />
                    <input
                      className={inputClass}
                      placeholder="LinkedIn"
                      value={form.linkedin}
                      onChange={(e) => updateField("linkedin", e.target.value)}
                    />
                  </div>
                </div>
              </section>

              <section>
                <p className={labelClass}>O mnie</p>
                <textarea
                  className={`${inputClass} h-32 resize-none leading-relaxed`}
                  placeholder="Krótki opis — kim jesteś i czego szukasz"
                  value={form.summary}
                  onChange={(e) => updateField("summary", e.target.value)}
                />
              </section>

              <section>
                <p className={labelClass}>Umiejętności (po przecinku)</p>
                <input
                  className={inputClass}
                  placeholder="React, Node.js, Docker"
                  value={form.skills}
                  onChange={(e) => updateField("skills", e.target.value)}
                />
              </section>

              <section>
                <div className="flex items-center justify-between mb-3">
                  <p className={`${labelClass} mb-0`}>Doświadczenie</p>
                  <button
                    type="button"
                    onClick={() => addItem("experience", emptyJob)}
                    className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-950 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Dodaj
                  </button>
                </div>
                <div className="space-y-4">
                  {form.experience.map((job, index) => (
                    <div
                      key={index}
                      className="bg-white border border-zinc-200 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeItem("experience", index)}
                          className="text-zinc-400 hover:text-red-500 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        className={inputClass}
                        placeholder="Stanowisko"
                        value={job.role}
                        onChange={(e) =>
                          updateList("experience", index, "role", e.target.value)
                        }
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          className={inputClass}
                          placeholder="Firma"
                          value={job.company}
                          onChange={(e) =>
                            updateList(
                              "experience",
                              index,
                              "company",
                              e.target.value,
                            )
                          }
                        />
                        <input
                          className={inputClass}
                          placeholder="Okres, np. 2022 — 2024"
                          value={job.period}
                          onChange={(e) =>
                            updateList(
                              "experience",
                              index,
                              "period",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <textarea
                        className={`${inputClass} h-24 resize-none`}
                        placeholder="Opis obowiązków i osiągnięć"
                        value={job.description}
                        onChange={(e) =>
                          updateList(
                            "experience",
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-3">
                  <p className={`${labelClass} mb-0`}>Wykształcenie</p>
                  <button
                    type="button"
                    onClick={() => addItem("education", emptySchool)}
                    className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-950 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Dodaj
                  </button>
                </div>
                <div className="space-y-4">
                  {form.education.map((school, index) => (
                    <div
                      key={index}
                      className="bg-white border border-zinc-200 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeItem("education", index)}
                          className="text-zinc-400 hover:text-red-500 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        className={inputClass}
                        placeholder="Kierunek / tytuł"
                        value={school.degree}
                        onChange={(e) =>
                          updateList(
                            "education",
                            index,
                            "degree",
                            e.target.value,
                          )
                        }
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          className={inputClass}
                          placeholder="Uczelnia"
                          value={school.school}
                          onChange={(e) =>
                            updateList(
                              "education",
                              index,
                              "school",
                              e.target.value,
                            )
                          }
                        />
                        <input
                          className={inputClass}
                          placeholder="Lata, np. 2018 — 2022"
                          value={school.period}
                          onChange={(e) =>
                            updateList(
                              "education",
                              index,
                              "period",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-3">
                  <p className={`${labelClass} mb-0`}>Projekty</p>
                  <button
                    type="button"
                    onClick={() => addItem("projects", emptyProject)}
                    className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-950 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Dodaj
                  </button>
                </div>
                <div className="space-y-4">
                  {(form.projects || []).map((project, index) => (
                    <div
                      key={index}
                      className="bg-white border border-zinc-200 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeItem("projects", index)}
                          className="text-zinc-400 hover:text-red-500 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        className={inputClass}
                        placeholder="Nazwa projektu"
                        value={project.name}
                        onChange={(e) =>
                          updateList("projects", index, "name", e.target.value)
                        }
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          className={inputClass}
                          placeholder="Technologie"
                          value={project.tech}
                          onChange={(e) =>
                            updateList("projects", index, "tech", e.target.value)
                          }
                        />
                        <input
                          className={inputClass}
                          placeholder="Link (GitHub, demo)"
                          value={project.link}
                          onChange={(e) =>
                            updateList("projects", index, "link", e.target.value)
                          }
                        />
                      </div>
                      <textarea
                        className={`${inputClass} h-24 resize-none`}
                        placeholder="Co zrobiłeś w projekcie"
                        value={project.description}
                        onChange={(e) =>
                          updateList(
                            "projects",
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-3">
                  <p className={`${labelClass} mb-0`}>Kursy i certyfikaty</p>
                  <button
                    type="button"
                    onClick={() => addItem("courses", emptyCourse)}
                    className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-950 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Dodaj
                  </button>
                </div>
                <div className="space-y-4">
                  {(form.courses || []).map((course, index) => (
                    <div
                      key={index}
                      className="bg-white border border-zinc-200 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeItem("courses", index)}
                          className="text-zinc-400 hover:text-red-500 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        className={inputClass}
                        placeholder="Nazwa kursu / certyfikatu"
                        value={course.name}
                        onChange={(e) =>
                          updateList("courses", index, "name", e.target.value)
                        }
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          className={inputClass}
                          placeholder="Organizator"
                          value={course.issuer}
                          onChange={(e) =>
                            updateList("courses", index, "issuer", e.target.value)
                          }
                        />
                        <input
                          className={inputClass}
                          placeholder="Rok"
                          value={course.year}
                          onChange={(e) =>
                            updateList("courses", index, "year", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <p className={labelClass}>Języki (po przecinku)</p>
                <input
                  className={inputClass}
                  placeholder="Polski, Angielski B2"
                  value={form.languages}
                  onChange={(e) => updateField("languages", e.target.value)}
                />
              </section>

              <section>
                <p className={labelClass}>Zainteresowania</p>
                <input
                  className={inputClass}
                  placeholder="Open source, fotografia, siatkówka"
                  value={form.interests}
                  onChange={(e) => updateField("interests", e.target.value)}
                />
              </section>
            </form>

            <aside className="bg-zinc-200/70 p-4 sm:p-6 min-w-0 lg:overflow-y-auto lg:h-full">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">
                Podgląd
              </p>
              <ScaledPreview form={form} />
            </aside>
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none fixed top-0 left-0 z-[-1] w-[794px] opacity-[0.01]"
        aria-hidden="true"
      >
        <CvPreview form={form} previewRef={previewRef} />
      </div>
    </div>,
    document.body,
  );
};

export default CvBuilder;
