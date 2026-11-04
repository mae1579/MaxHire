import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NotFound = ({
  code = "404",
  title = "Nie ma takiej strony",
  description = "Ten adres nic nie otwiera. Wróć na start albo do listy zleceń.",
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] w-full px-6 py-16">
      <div className="w-full max-w-lg text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-purple-600">{code}</p>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
          {title}
        </h1>
        <p className="mt-3 text-zinc-500 text-sm sm:text-base">{description}</p>
        {path && path !== "/" && (
          <p className="mt-2 text-xs text-zinc-400 font-mono break-all">{path}</p>
        )}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-950 text-white font-semibold hover:bg-zinc-800 transition-colors"
          >
            Strona główna
          </Link>
          {user ? (
            <Link
              to="/browse"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-gray-200 text-zinc-950 font-semibold hover:shadow-md transition-all"
            >
              Przeglądaj zlecenia
            </Link>
          ) : (
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-gray-200 text-zinc-950 font-semibold hover:shadow-md transition-all"
            >
              Zaloguj się
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
