import React from "react";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. Jakie dane zbieramy",
    body: "Konto: imię, nazwisko, e-mail, opcjonalnie telefon i zdjęcie. Ogłoszenia i CV, które sam dodajesz. Dane logowania w ciasteczku httpOnly (sesja).",
  },
  {
    title: "2. Po co",
    body: "Żeby działało konto, lista ogłoszeń, profil i generator CV. E-mail wykorzystujemy do logowania linkiem i resetu hasła.",
  },
  {
    title: "3. Pliki i zdjęcia",
    body: "Zdjęcie profilowe i CV trafiają na serwer / Cloudinary, jeśli z nich korzystasz. Nie wgrywaj danych innych osób bez zgody.",
  },
  {
    title: "4. Ciasteczka",
    body: "Używamy ciasteczka sesji do zalogowania. Bez niego chronione strony (przeglądanie, profil) nie działają.",
  },
  {
    title: "5. Kontakt",
    body: "Pytania o dane: strona Kontakt albo e-mail podany w stopce kontaktu.",
  },
];

const Prywatnosc = () => {
  return (
    <div className="flex justify-center min-h-screen w-full px-6 py-12">
      <div className="flex flex-col w-full max-w-2xl p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl text-zinc-100">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Polityka prywatności
        </h1>
        <p className="text-zinc-400 mt-2 text-sm">
          Obowiązuje od 19 października 2026 r. Serwis ma charakter edukacyjny.
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
          Zobacz też{" "}
          <Link to="/regulamin" className="text-zinc-200 hover:text-white underline underline-offset-4">
            regulamin
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Prywatnosc;
