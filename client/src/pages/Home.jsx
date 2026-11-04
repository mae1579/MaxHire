import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  Code2,
  Briefcase,
  Github,
  Layers,
  LogIn,
  UserPlus,
  Terminal,
  ArrowRight,
  FileText,
  PlusSquare,
} from "lucide-react";
import api from "../api/client";
import Listings from "../components/offers/Listings";

const STACK = ["React", "Vite", "Express.js", "Node.js", "JavaScript", "Tailwind CSS", "JWT"];

const TEASER_OFFERS = [
  {
    id: "teaser-1",
    title: "Landing page produktu",
    company: "MarketingPro",
    description: "Efektowny landing z animacjami i formularzem leadów.",
    tech: '["React","GSAP","JavaScript"]',
    updated: Date.now(),
    photo: "",
  },
  {
    id: "teaser-2",
    title: "Rozbudowa API",
    company: "BackendPro",
    description: "Nowe endpointy, JWT i dokumentacja Swagger.",
    tech: '["Go","PostgreSQL","Docker"]',
    updated: Date.now() - 3600_000,
    photo: "",
  },
  {
    id: "teaser-3",
    title: "Aplikacja CRM",
    company: "TransSoft",
    description: "Panel dla floty i raporty dla księgowości.",
    tech: '["TypeScript","Node.js","SQL"]',
    updated: Date.now() - 86400_000,
    photo: "",
  },
];

const cardClass =
  "bg-white border border-gray-100 p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group block h-full";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setOffers([]);
      return;
    }
    setLoading(true);
    api
      .get("/offers?page=1")
      .then((res) => {
        const list = Array.isArray(res.data?.offers) ? res.data.offers : [];
        setOffers(list.slice(0, 3));
      })
      .catch(() => setOffers([]))
      .finally(() => setLoading(false));
  }, [user]);

  const goBrowseSearch = (tag) => {
    navigate(`/browse?search=${encodeURIComponent(tag)}&page=1`);
  };

  return (
    <div className="min-h-screen text-gray-900 font-sans">
      <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] -z-10" />

      <header className="pt-16 pb-12 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-black text-balance">
          Zlecenia i projekty <br /> programistyczne.
        </h1>
        <p className="max-w-xl mx-auto text-gray-500 text-base mb-8">
          MaxHire to prosta platforma do publikowania i przeglądania ofert współpracy.
          Znajdź wykonawcę do swojego projektu lub podejmij się nowego zlecenia.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {user ? (
            <>
              <Link
                to="/browse"
                className="w-full sm:w-auto px-6 py-2.5 bg-black text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:bg-gray-800 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                <Search size={16} />
                Przeglądaj
              </Link>
              <Link
                to="/createOffer"
                className="w-full sm:w-auto px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 hover:scale-105 active:scale-95"
              >
                <PlusSquare size={16} />
                Dodaj ogłoszenie
              </Link>
            </>
          ) : (
            <div className="flex flex-row gap-3">
              <Link
                to="/login?mode=register"
                className="w-full sm:w-auto px-6 py-2.5 bg-black text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:bg-gray-800 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                <UserPlus size={16} />
                Załóż konto
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 hover:scale-105 active:scale-95"
              >
                <LogIn size={16} />
                Zaloguj się
              </Link>
            </div>
          )}
          <a
            href="https://github.com/mae1579/MaxHire"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#0d1117] text-gray-100 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:bg-gray-800 hover:scale-105 active:scale-95"
          >
            <Github size={16} />
            GitHub
          </a>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link to="/browse" className={cardClass}>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-4 transition-colors group-hover:bg-purple-100">
              <Search className="text-purple-600" size={20} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-black">Przeglądaj zlecenia</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Aktualna lista projektów. Szukaj po nazwie albo technologii.
            </p>
          </Link>

          <Link to="/browse" className={cardClass}>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4 transition-colors group-hover:bg-blue-100">
              <Terminal className="text-blue-600" size={20} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-black">Wymagany stack</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Każda oferta ma listę technologii — React, Node, Docker i reszta.
            </p>
          </Link>

          <Link to="/createOffer" className={cardClass}>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4 transition-colors group-hover:bg-green-100">
              <Briefcase className="text-green-600" size={20} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-black">Dodaj projekt</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Opublikuj ogłoszenie i znajdź podwykonawcę.
            </p>
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-purple-600 mb-1">
              Tablica
            </p>
            <h2 className="text-2xl font-bold text-black">Ostatnie zlecenia</h2>
          </div>
          {user && (
            <Link
              to="/browse"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-zinc-600 hover:text-black"
            >
              Wszystkie <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {user ? (
          <>
            <Listings
              offers={offers}
              loading={loading}
              error={null}
              onTagClick={goBrowseSearch}
              emptyTitle="Nie ma jeszcze ogłoszeń"
              emptyDescription="Jak ktoś doda zlecenie, pojawi się tutaj."
            />
            <Link
              to="/browse"
              className="mt-4 sm:hidden flex items-center justify-center gap-1 text-sm font-semibold text-zinc-600"
            >
              Wszystkie ogłoszenia <ArrowRight size={16} />
            </Link>
          </>
        ) : (
          <div className="relative">
            <div className="pointer-events-none select-none opacity-60 blur-[1px]">
              <Listings
                offers={TEASER_OFFERS}
                loading={false}
                error={null}
                onTagClick={() => {}}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white/95 border border-zinc-200 rounded-2xl shadow-xl px-6 py-5 text-center max-w-sm">
                <p className="font-bold text-zinc-900 mb-1">Zaloguj się, żeby przeglądać</p>
                <p className="text-sm text-zinc-500 mb-4">
                  Lista zleceń jest dla kont. Załóż darmowe albo wejdź na istniejące.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-zinc-800"
                >
                  <LogIn size={16} /> Do logowania
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-12">
        <h2 className="text-2xl font-bold text-black text-center mb-8">Jak to działa</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl border border-gray-100 bg-white">
            <p className="text-xs font-black text-purple-600 mb-2">01</p>
            <UserPlus className="text-zinc-400 mb-3" size={20} />
            <h3 className="font-bold mb-1">Konto</h3>
            <p className="text-sm text-gray-500">Rejestracja albo login linkiem na maila.</p>
          </div>
          <div className="p-5 rounded-2xl border border-gray-100 bg-white">
            <p className="text-xs font-black text-purple-600 mb-2">02</p>
            <FileText className="text-zinc-400 mb-3" size={20} />
            <h3 className="font-bold mb-1">CV albo ogłoszenie</h3>
            <p className="text-sm text-gray-500">Generator PDF na profilu albo nowe zlecenie.</p>
          </div>
          <div className="p-5 rounded-2xl border border-gray-100 bg-white">
            <p className="text-xs font-black text-purple-600 mb-2">03</p>
            <Briefcase className="text-zinc-400 mb-3" size={20} />
            <h3 className="font-bold mb-1">Współpraca</h3>
            <p className="text-sm text-gray-500">Aplikuj mailem albo znajdź wykonawcę.</p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12 border-t border-gray-100">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-purple-600 font-bold mb-3 uppercase tracking-wider text-[10px]">
            <Layers size={14} />
            <span>Technologie projektu</span>
          </div>
          <h2 className="text-2xl font-bold mb-8 text-black">Wykorzystany stack</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {STACK.map((tech) => (
              <Link
                key={tech}
                to={`/browse?search=${encodeURIComponent(tech)}&page=1`}
                className="px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-gray-600 text-xs flex items-center gap-1.5 transition-colors hover:bg-gray-100 hover:border-gray-200"
              >
                <Code2 size={12} />
                {tech}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
