import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Camera, Download, FileText, Plus, User, X } from "lucide-react";
import toast from "react-hot-toast";
import { downloadCvPdf } from "../../utils/downloadCvPdf";

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
});

const CvPreview = ({ form, previewRef }) => {
  const skills = form.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const languages = form.languages
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const jobs = (form.experience || []).filter(
    (j) => j.role || j.company || j.description,
  );
  const schools = (form.education || []).filter((s) => s.degree || s.school);
  const projects = (form.projects || []).filter(
    (p) => p.name || p.description || p.link,
  );
  const courses = (form.courses || []).filter((c) => c.name || c.issuer);
  const links = [form.website, form.github, form.linkedin].filter(Boolean);

  return (
    <div
      ref={previewRef}
      className="bg-white text-zinc-900 w-[794px] min-h-[1123px] p-10 box-border break-words"
    >
      <div className="border-b-2 border-zinc-950 pb-6 mb-6 flex gap-6 items-start">
        {form.photo ? (
          <img
            src={form.photo}
            alt=""
            {...(form.photo.startsWith("http")
              ? { crossOrigin: "anonymous" }
              : {})}
            className="w-24 h-24 rounded-2xl object-cover shrink-0 border-2 border-zinc-950 bg-zinc-100"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-400 mb-2">
            MaxHire CV
          </p>
          <h1 className="text-4xl font-black uppercase italic tracking-tight leading-tight break-words">
            {form.fullName || "Imię i nazwisko"}
          </h1>
          {form.title && (
            <p className="mt-2 text-sm font-bold uppercase tracking-widest text-zinc-500">
              {form.title}
            </p>
          )}
          {form.availability && (
            <p className="mt-1 text-xs font-semibold text-zinc-500">
              {form.availability}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-zinc-600">
            {form.email && <span>{form.email}</span>}
            {form.phone && <span>{form.phone}</span>}
            {form.location && <span>{form.location}</span>}
            {links.map((link) => (
              <span key={link} className="break-all">
                {link}
              </span>
            ))}
          </div>
        </div>
      </div>

      {form.summary && (
        <section className="mb-6">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-950 mb-2 underline decoration-zinc-300 underline-offset-4">
            O mnie
          </h2>
          <p className="text-sm leading-relaxed font-medium text-zinc-700 whitespace-pre-wrap">
            {form.summary}
          </p>
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-950 mb-3 underline decoration-zinc-300 underline-offset-4">
            Umiejętności
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="text-[9px] font-black bg-zinc-950 text-white px-2.5 py-1 rounded-md uppercase tracking-widest"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {jobs.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-950 mb-3 underline decoration-zinc-300 underline-offset-4">
            Doświadczenie
          </h2>
          <div className="space-y-4">
            {jobs.map((job, idx) => (
              <div key={idx} className="min-w-0">
                <div className="flex justify-between gap-4 items-baseline">
                  <p className="font-black text-sm uppercase tracking-tight break-words min-w-0">
                    {job.role || "Stanowisko"}
                  </p>
                  {job.period && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 shrink-0">
                      {job.period}
                    </p>
                  )}
                </div>
                {job.company && (
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mt-0.5">
                    {job.company}
                  </p>
                )}
                {job.description && (
                  <p className="text-sm text-zinc-700 mt-1 leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {schools.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-950 mb-3 underline decoration-zinc-300 underline-offset-4">
            Wykształcenie
          </h2>
          <div className="space-y-3">
            {schools.map((school, idx) => (
              <div key={idx} className="flex justify-between gap-4">
                <div>
                  <p className="font-black text-sm uppercase tracking-tight">
                    {school.degree || "Kierunek"}
                  </p>
                  {school.school && (
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                      {school.school}
                    </p>
                  )}
                </div>
                {school.period && (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 shrink-0">
                    {school.period}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-950 mb-3 underline decoration-zinc-300 underline-offset-4">
            Projekty
          </h2>
          <div className="space-y-4">
            {projects.map((project, idx) => (
              <div key={idx} className="min-w-0">
                <div className="flex justify-between gap-4 items-baseline">
                  <p className="font-black text-sm uppercase tracking-tight break-words">
                    {project.name || "Projekt"}
                  </p>
                  {project.link && (
                    <p className="text-[10px] font-bold text-zinc-400 break-all shrink-0 max-w-[40%]">
                      {project.link}
                    </p>
                  )}
                </div>
                {project.tech && (
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mt-0.5">
                    {project.tech}
                  </p>
                )}
                {project.description && (
                  <p className="text-sm text-zinc-700 mt-1 leading-relaxed whitespace-pre-wrap">
                    {project.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {courses.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-950 mb-3 underline decoration-zinc-300 underline-offset-4">
            Kursy i certyfikaty
          </h2>
          <div className="space-y-3">
            {courses.map((course, idx) => (
              <div key={idx} className="flex justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-black text-sm uppercase tracking-tight">
                    {course.name || "Kurs"}
                  </p>
                  {course.issuer && (
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                      {course.issuer}
                    </p>
                  )}
                </div>
                {course.year && (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 shrink-0">
                    {course.year}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {languages.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-950 mb-3 underline decoration-zinc-300 underline-offset-4">
            Języki
          </h2>
          <p className="text-sm font-semibold text-zinc-700">
            {languages.join(" · ")}
          </p>
        </section>
      )}

      {form.interests && (
        <section>
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-950 mb-3 underline decoration-zinc-300 underline-offset-4">
            Zainteresowania
          </h2>
          <p className="text-sm font-semibold text-zinc-700">{form.interests}</p>
        </section>
      )}
    </div>
  );
};

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

const CvBuilder = ({ profile, onClose }) => {
  const previewRef = useRef(null);
  const photoInputRef = useRef(null);
  const storageKey = `cv-draft-${profile?.id || "guest"}`;
  const [downloading, setDownloading] = useState(false);
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

  const handleDownload = async () => {
    if (!form.fullName.trim()) {
      toast.error("Podaj imię i nazwisko");
      return;
    }
    setDownloading(true);
    const toastId = toast.loading("Generowanie CV...");
    try {
      const slug = form.fullName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-ąćęłńóśźż]/gi, "");
      await downloadCvPdf(previewRef.current, `CV-${slug || "maxhire"}.pdf`);
      toast.success("CV pobrane", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Nie udało się wygenerować PDF", { id: toastId });
    } finally {
      setDownloading(false);
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-zinc-950 text-white px-4 sm:px-5 py-3 rounded-xl font-black uppercase tracking-tighter hover:bg-zinc-800 transition-all shadow-lg active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs"
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
