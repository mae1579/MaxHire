import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const REPO = "mae1579/MaxHire";
const STATS_URL = `https://api.github.com/repos/${REPO}/stats/contributors`;

const formatNum = (n) =>
  new Intl.NumberFormat("pl-PL").format(Math.max(0, n || 0));

const sumWeeks = (weeks = []) =>
  weeks.reduce(
    (acc, week) => ({
      added: acc.added + (week.a || 0),
      deleted: acc.deleted + (week.d || 0),
      commits: acc.commits + (week.c || 0),
    }),
    { added: 0, deleted: 0, commits: 0 },
  );

const fetchStats = async () => {
  for (let i = 0; i < 4; i += 1) {
    const res = await fetch(STATS_URL, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (res.status === 202) {
      await new Promise((r) => setTimeout(r, 1200));
      continue;
    }
    if (!res.ok) throw new Error("GitHub API error");
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      await new Promise((r) => setTimeout(r, 1200));
      continue;
    }
    return data
      .map((entry) => {
        const totals = sumWeeks(entry.weeks);
        return {
          login: entry.author?.login || "unknown",
          avatar: entry.author?.avatar_url || "",
          url: entry.author?.html_url || `https://github.com/${REPO}`,
          ...totals,
        };
      })
      .sort((a, b) => b.added + b.deleted - (a.added + a.deleted));
  }
  throw new Error("Brak danych");
};

const ContributorsEgg = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [people, setPeople] = useState([]);

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchStats()
      .then((data) => {
        if (!cancelled) setPeople(data);
      })
      .catch(() => {
        if (!cancelled) setError("Nie udało się pobrać statystyk z GitHuba.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Statystyki contributorów"
        onClick={() => setOpen(true)}
        className="mt-3 w-1.5 h-1.5 rounded-full bg-zinc-800 hover:bg-zinc-500 transition-colors cursor-pointer"
      />
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[90] bg-zinc-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl text-zinc-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Easter egg
                  </p>
                  <h3 className="text-sm font-black uppercase italic tracking-tighter">
                    Contributorzy
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="h-9 w-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center cursor-pointer hover:bg-zinc-800"
                  aria-label="Zamknij"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="px-4 py-3 max-h-[60vh] overflow-y-auto">
                {loading && (
                  <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 py-6 text-center">
                    Liczenie linii...
                  </p>
                )}
                {error && (
                  <p className="text-xs text-red-400 py-6 text-center">{error}</p>
                )}
                {!loading && !error && (
                  <ul className="space-y-3">
                    {people.map((person) => (
                      <li key={person.login}>
                        <a
                          href={person.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-2.5 hover:border-zinc-600 transition-colors"
                        >
                          {person.avatar ? (
                            <img
                              src={person.avatar}
                              alt=""
                              className="w-9 h-9 rounded-full"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-zinc-800" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold truncate">
                              {person.login}
                            </p>
                            <p className="text-[11px] font-semibold text-zinc-400">
                              <span className="text-emerald-400">
                                +{formatNum(person.added)}
                              </span>
                              {"  "}
                              <span className="text-red-400">
                                −{formatNum(person.deleted)}
                              </span>
                              {"  "}
                              <span className="text-zinc-500">
                                {formatNum(person.commits)} commitów
                              </span>
                            </p>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default ContributorsEgg;
