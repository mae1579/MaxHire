import React from "react";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. Postanowienia ogólne",
    body: "MaxHire to serwis ogłoszeniowy dla zleceń i projektów programistycznych. Korzystając z platformy, akceptujesz ten regulamin. Serwis ma charakter edukacyjny i nie stanowi oferty w rozumieniu kodeksu cywilnego.",
  },
  {
    title: "2. Konto",
    body: "Konto zakładasz podając prawdziwe dane. Jesteś odpowiedzialny za hasło i działania wykonane z Twojego konta. Zastrzegamy sobie prawo do usunięcia konta naruszającego regulamin lub przepisy prawa.",
  },
  {
    title: "3. Ogłoszenia",
    body: "Ogłoszenia publikujesz na własną odpowiedzialność. Treść ma być zgodna z prawem, bez spamu, oszustw i materiałów obraźliwych. MaxHire nie jest stroną umów między ogłoszeniodawcą a osobą aplikującą i nie gwarantuje zlecenia ani zapłaty.",
  },
  {
    title: "4. CV i pliki",
    body: "CV, zdjęcia i inne pliki wysyłasz dobrowolnie. Nie wgrywaj danych osób trzecich bez zgody. Generator CV służy wyłącznie do przygotowania własnego dokumentu.",
  },
  {
    title: "5. Odpowiedzialność",
    body: "Dokładamy starań, żeby serwis działał, ale nie odpowiadamy za przerwy, utratę danych, treść ogłoszeń ani skutki współpracy użytkowników. Korzystasz z platformy na własną odpowiedzialność.",
  },
  {
    title: "6. Kontakt",
    body: "Pytania dotyczące regulaminu możesz zgłosić przez stronę Kontakt.",
  },
];

const Regulamin = () => {
  return (
    <div className="flex justify-center min-h-screen w-full px-6 py-12">
      <div className="flex flex-col w-full max-w-2xl p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl text-zinc-100">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Regulamin
        </h1>
        <p className="text-zinc-400 mt-2 text-sm">
          Obowiązuje od 15 października 2026 r.
        </p>

        <div className="mt-8 space-y-6">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-200 mb-2">
                {section.title}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-8 pt-4 border-t border-zinc-800/50 text-xs text-zinc-500">
          Masz pytanie?{" "}
          <Link to="/contact" className="text-zinc-200 hover:text-white underline underline-offset-4">
            Napisz do nas
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Regulamin;
