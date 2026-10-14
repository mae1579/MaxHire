import React from "react";

export const CV_TEMPLATES = [
  { id: "classic", label: "MaxHire", hint: "Czarno-biały, uppercase", swatch: "bg-zinc-950" },
  { id: "sidebar", label: "Sidebar", hint: "Ciemna belka z lewej", swatch: "bg-zinc-900" },
  { id: "minimal", label: "Minimal", hint: "Dużo powietrza, spokojny", swatch: "bg-zinc-300" },
  { id: "navy", label: "Navy", hint: "Nagłówek i akcent", swatch: "bg-[#0f172a]" },
];

const photoProps = (src) =>
  src?.startsWith("http") ? { crossOrigin: "anonymous" } : {};

const getModel = (form) => ({
  ...form,
  skills: (form.skills || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  languages: (form.languages || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  jobs: (form.experience || []).filter((j) => j.role || j.company || j.description),
  schools: (form.education || []).filter((s) => s.degree || s.school),
  projects: (form.projects || []).filter((p) => p.name || p.description || p.link),
  courses: (form.courses || []).filter((c) => c.name || c.issuer),
  links: [form.website, form.github, form.linkedin].filter(Boolean),
});

const ClassicBody = ({ m }) => (
  <>
    {m.summary && (
      <section className="mb-6">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-950 mb-2 underline decoration-zinc-300 underline-offset-4">
          O mnie
        </h2>
        <p className="text-sm leading-relaxed font-medium text-zinc-700 whitespace-pre-wrap">
          {m.summary}
        </p>
      </section>
    )}
    {m.skills.length > 0 && (
      <section className="mb-6">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-950 mb-3 underline decoration-zinc-300 underline-offset-4">
          Umiejętności
        </h2>
        <div className="flex flex-wrap gap-2">
          {m.skills.map((skill) => (
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
    {m.jobs.length > 0 && (
      <section className="mb-6">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-950 mb-3 underline decoration-zinc-300 underline-offset-4">
          Doświadczenie
        </h2>
        <div className="space-y-4">
          {m.jobs.map((job, idx) => (
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
    {m.schools.length > 0 && (
      <section className="mb-6">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-950 mb-3 underline decoration-zinc-300 underline-offset-4">
          Wykształcenie
        </h2>
        <div className="space-y-3">
          {m.schools.map((school, idx) => (
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
    {m.projects.length > 0 && (
      <section className="mb-6">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-950 mb-3 underline decoration-zinc-300 underline-offset-4">
          Projekty
        </h2>
        <div className="space-y-4">
          {m.projects.map((project, idx) => (
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
    {m.courses.length > 0 && (
      <section className="mb-6">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-950 mb-3 underline decoration-zinc-300 underline-offset-4">
          Kursy i certyfikaty
        </h2>
        <div className="space-y-3">
          {m.courses.map((course, idx) => (
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
    {m.languages.length > 0 && (
      <section className="mb-6">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-950 mb-3 underline decoration-zinc-300 underline-offset-4">
          Języki
        </h2>
        <p className="text-sm font-semibold text-zinc-700">
          {m.languages.join(" · ")}
        </p>
      </section>
    )}
    {m.interests && (
      <section>
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-950 mb-3 underline decoration-zinc-300 underline-offset-4">
          Zainteresowania
        </h2>
        <p className="text-sm font-semibold text-zinc-700">{m.interests}</p>
      </section>
    )}
  </>
);

const ClassicPreview = ({ m, previewRef }) => (
  <div
    ref={previewRef}
    className="bg-white text-zinc-900 w-[794px] min-h-[1123px] p-10 box-border break-words"
  >
    <div className="border-b-2 border-zinc-950 pb-6 mb-6 flex gap-6 items-start">
      {m.photo ? (
        <img
          src={m.photo}
          alt=""
          {...photoProps(m.photo)}
          className="w-24 h-24 rounded-2xl object-cover shrink-0 border-2 border-zinc-950 bg-zinc-100"
        />
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-400 mb-2">
          MaxHire CV
        </p>
        <h1 className="text-4xl font-black uppercase italic tracking-tight leading-tight break-words">
          {m.fullName || "Imię i nazwisko"}
        </h1>
        {m.title && (
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-zinc-500">
            {m.title}
          </p>
        )}
        {m.availability && (
          <p className="mt-1 text-xs font-semibold text-zinc-500">{m.availability}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-zinc-600">
          {m.email && <span>{m.email}</span>}
          {m.phone && <span>{m.phone}</span>}
          {m.location && <span>{m.location}</span>}
          {m.links.map((link) => (
            <span key={link} className="break-all">
              {link}
            </span>
          ))}
        </div>
      </div>
    </div>
    <ClassicBody m={m} />
  </div>
);

const SidebarPreview = ({ m, previewRef }) => (
  <div
    ref={previewRef}
    className="bg-white text-zinc-900 w-[794px] min-h-[1123px] box-border break-words flex"
  >
    <aside className="w-[240px] shrink-0 bg-zinc-950 text-zinc-100 p-7">
      {m.photo ? (
        <img
          src={m.photo}
          alt=""
          {...photoProps(m.photo)}
          className="w-28 h-28 rounded-full object-cover mx-auto mb-6 border-2 border-zinc-700"
        />
      ) : (
        <div className="w-28 h-28 rounded-full bg-zinc-800 mx-auto mb-6" />
      )}
      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">
        Kontakt
      </p>
      <div className="space-y-1.5 text-[11px] font-semibold text-zinc-300 mb-6 break-all">
        {m.email && <p>{m.email}</p>}
        {m.phone && <p>{m.phone}</p>}
        {m.location && <p>{m.location}</p>}
        {m.links.map((link) => (
          <p key={link}>{link}</p>
        ))}
      </div>
      {m.skills.length > 0 && (
        <>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">
            Stack
          </p>
          <div className="flex flex-col gap-1 mb-6">
            {m.skills.map((skill) => (
              <span key={skill} className="text-[11px] font-bold text-white">
                {skill}
              </span>
            ))}
          </div>
        </>
      )}
      {m.languages.length > 0 && (
        <>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">
            Języki
          </p>
          <p className="text-[11px] font-semibold text-zinc-300">
            {m.languages.join(" · ")}
          </p>
        </>
      )}
    </aside>
    <div className="flex-1 min-w-0 p-9">
      <h1 className="text-3xl font-black tracking-tight leading-tight">
        {m.fullName || "Imię i nazwisko"}
      </h1>
      {m.title && (
        <p className="mt-1 text-sm font-bold text-zinc-500 uppercase tracking-widest">
          {m.title}
        </p>
      )}
      {m.availability && (
        <p className="mt-1 text-xs text-zinc-500">{m.availability}</p>
      )}
      <div className="mt-6">
        <ClassicBody m={{ ...m, skills: [], languages: [] }} />
      </div>
    </div>
  </div>
);

const MinimalPreview = ({ m, previewRef }) => (
  <div
    ref={previewRef}
    className="bg-white text-zinc-800 w-[794px] min-h-[1123px] p-14 box-border break-words"
    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
  >
    <div className="flex items-end justify-between gap-6 border-b border-zinc-200 pb-8 mb-8">
      <div className="min-w-0">
        <h1 className="text-4xl font-normal tracking-tight">
          {m.fullName || "Imię i nazwisko"}
        </h1>
        {m.title && (
          <p className="mt-2 text-sm tracking-wide text-zinc-500">{m.title}</p>
        )}
        {m.availability && (
          <p className="mt-1 text-xs text-zinc-400">{m.availability}</p>
        )}
      </div>
      {m.photo ? (
        <img
          src={m.photo}
          alt=""
          {...photoProps(m.photo)}
          className="w-20 h-20 rounded-full object-cover shrink-0 grayscale"
        />
      ) : null}
    </div>
    <p className="text-[11px] text-zinc-500 mb-10 leading-relaxed">
      {[m.email, m.phone, m.location, ...m.links].filter(Boolean).join("  ·  ")}
    </p>
    {m.summary && (
      <section className="mb-8">
        <h2 className="text-[11px] tracking-[0.25em] uppercase text-zinc-400 mb-3">
          Profil
        </h2>
        <p className="text-[15px] leading-7 whitespace-pre-wrap">{m.summary}</p>
      </section>
    )}
    {m.jobs.length > 0 && (
      <section className="mb-8">
        <h2 className="text-[11px] tracking-[0.25em] uppercase text-zinc-400 mb-3">
          Doświadczenie
        </h2>
        <div className="space-y-5">
          {m.jobs.map((job, idx) => (
            <div key={idx}>
              <p className="text-[15px]">
                {job.role}
                {job.company ? ` — ${job.company}` : ""}
                {job.period ? (
                  <span className="text-zinc-400"> · {job.period}</span>
                ) : null}
              </p>
              {job.description && (
                <p className="text-sm text-zinc-600 mt-1 leading-6 whitespace-pre-wrap">
                  {job.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    )}
    {m.skills.length > 0 && (
      <section className="mb-8">
        <h2 className="text-[11px] tracking-[0.25em] uppercase text-zinc-400 mb-3">
          Umiejętności
        </h2>
        <p className="text-sm leading-6">{m.skills.join("  /  ")}</p>
      </section>
    )}
    {m.schools.length > 0 && (
      <section className="mb-8">
        <h2 className="text-[11px] tracking-[0.25em] uppercase text-zinc-400 mb-3">
          Wykształcenie
        </h2>
        {m.schools.map((school, idx) => (
          <p key={idx} className="text-sm mb-1">
            {school.degree}
            {school.school ? `, ${school.school}` : ""}
            {school.period ? ` (${school.period})` : ""}
          </p>
        ))}
      </section>
    )}
    {m.projects.length > 0 && (
      <section className="mb-8">
        <h2 className="text-[11px] tracking-[0.25em] uppercase text-zinc-400 mb-3">
          Projekty
        </h2>
        {m.projects.map((project, idx) => (
          <p key={idx} className="text-sm mb-2">
            <span className="font-semibold">{project.name}</span>
            {project.tech ? ` — ${project.tech}` : ""}
            {project.description ? `. ${project.description}` : ""}
          </p>
        ))}
      </section>
    )}
    {m.courses.length > 0 && (
      <section className="mb-8">
        <h2 className="text-[11px] tracking-[0.25em] uppercase text-zinc-400 mb-3">
          Kursy
        </h2>
        {m.courses.map((course, idx) => (
          <p key={idx} className="text-sm">
            {course.name}
            {course.issuer ? `, ${course.issuer}` : ""}
            {course.year ? ` (${course.year})` : ""}
          </p>
        ))}
      </section>
    )}
    {m.languages.length > 0 && (
      <p className="text-sm text-zinc-500">Języki: {m.languages.join(", ")}</p>
    )}
    {m.interests && (
      <p className="text-sm text-zinc-500 mt-2">Zainteresowania: {m.interests}</p>
    )}
  </div>
);

const NavyPreview = ({ m, previewRef }) => (
  <div
    ref={previewRef}
    className="bg-white text-zinc-900 w-[794px] min-h-[1123px] box-border break-words"
  >
    <header className="bg-[#0f172a] text-white px-10 py-8 flex gap-6 items-center">
      {m.photo ? (
        <img
          src={m.photo}
          alt=""
          {...photoProps(m.photo)}
          className="w-24 h-24 rounded-xl object-cover shrink-0 border border-white/20"
        />
      ) : null}
      <div className="min-w-0">
        <h1 className="text-3xl font-black tracking-tight">
          {m.fullName || "Imię i nazwisko"}
        </h1>
        {m.title && (
          <p className="mt-1 text-sm font-semibold text-[#7dd3fc]">{m.title}</p>
        )}
        {m.availability && (
          <p className="mt-1 text-xs text-slate-300">{m.availability}</p>
        )}
        <p className="mt-3 text-[11px] text-slate-300">
          {[m.email, m.phone, m.location].filter(Boolean).join("  ·  ")}
        </p>
      </div>
    </header>
    <div className="px-10 py-8">
      {m.links.length > 0 && (
        <p className="text-[11px] text-slate-500 mb-6 break-all">
          {m.links.join("  ·  ")}
        </p>
      )}
      {m.summary && (
        <section className="mb-6">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-[#0f172a] border-l-4 border-[#38bdf8] pl-3 mb-2">
            O mnie
          </h2>
          <p className="text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">
            {m.summary}
          </p>
        </section>
      )}
      {m.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-[#0f172a] border-l-4 border-[#38bdf8] pl-3 mb-3">
            Umiejętności
          </h2>
          <div className="flex flex-wrap gap-2">
            {m.skills.map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-bold bg-[#0f172a] text-white px-2.5 py-1 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
      {m.jobs.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-[#0f172a] border-l-4 border-[#38bdf8] pl-3 mb-3">
            Doświadczenie
          </h2>
          <div className="space-y-4">
            {m.jobs.map((job, idx) => (
              <div key={idx}>
                <p className="font-bold text-sm">
                  {job.role} {job.company ? `· ${job.company}` : ""}
                </p>
                {job.period && (
                  <p className="text-[11px] text-sky-700 font-semibold">{job.period}</p>
                )}
                {job.description && (
                  <p className="text-sm text-zinc-700 mt-1 whitespace-pre-wrap">
                    {job.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {m.schools.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-[#0f172a] border-l-4 border-[#38bdf8] pl-3 mb-3">
            Wykształcenie
          </h2>
          {m.schools.map((school, idx) => (
            <p key={idx} className="text-sm mb-1">
              <span className="font-bold">{school.degree}</span>
              {school.school ? ` — ${school.school}` : ""}
              {school.period ? ` (${school.period})` : ""}
            </p>
          ))}
        </section>
      )}
      {m.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-[#0f172a] border-l-4 border-[#38bdf8] pl-3 mb-3">
            Projekty
          </h2>
          {m.projects.map((project, idx) => (
            <div key={idx} className="mb-3">
              <p className="font-bold text-sm">{project.name}</p>
              {project.tech && (
                <p className="text-[11px] text-sky-700">{project.tech}</p>
              )}
              {project.description && (
                <p className="text-sm text-zinc-700">{project.description}</p>
              )}
            </div>
          ))}
        </section>
      )}
      {m.courses.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-[#0f172a] border-l-4 border-[#38bdf8] pl-3 mb-3">
            Kursy
          </h2>
          {m.courses.map((course, idx) => (
            <p key={idx} className="text-sm">
              {course.name}
              {course.issuer ? ` · ${course.issuer}` : ""}
              {course.year ? ` (${course.year})` : ""}
            </p>
          ))}
        </section>
      )}
      {m.languages.length > 0 && (
        <p className="text-sm">
          <span className="font-bold">Języki: </span>
          {m.languages.join(", ")}
        </p>
      )}
      {m.interests && (
        <p className="text-sm mt-2">
          <span className="font-bold">Zainteresowania: </span>
          {m.interests}
        </p>
      )}
    </div>
  </div>
);

const CvPreview = ({ form, previewRef }) => {
  const m = getModel(form);
  const template = form.template || "classic";
  if (template === "sidebar") return <SidebarPreview m={m} previewRef={previewRef} />;
  if (template === "minimal") return <MinimalPreview m={m} previewRef={previewRef} />;
  if (template === "navy") return <NavyPreview m={m} previewRef={previewRef} />;
  return <ClassicPreview m={m} previewRef={previewRef} />;
};

export default CvPreview;
