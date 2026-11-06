import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, DollarSign, Search, Sparkles, ChevronDown, LoaderCircle, ArrowRight } from 'lucide-react';
import Listings from "../components/offers/Listings";
import BrowsePagination from "../components/offers/BrowsePagination";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { getSavedCvMeta } from "../utils/cvStorage";

const Browse = () => {
  const { user, setUser } = useAuth();
  const [offers, setOffers] = useState([]);
  const [matchedOffers, setMatchedOffers] = useState([]);
  const [matchedMessage, setMatchedMessage] = useState('');
  const [matchedLoading, setMatchedLoading] = useState(false);
  const [matchedError, setMatchedError] = useState(null);
  const [matchedLoaded, setMatchedLoaded] = useState(false);
  const [matchedOpen, setMatchedOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [reloadToken, setReloadToken] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page')) || 1;
  const searchTerm = searchParams.get('search') || '';
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [hasCv, setHasCv] = useState(
    () => typeof user?.cv_url === 'string' && user.cv_url.trim().length > 0,
  );

  const updateParams = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...current, ...newParams });
  };

  const commitSearch = () => {
    if (localSearch !== searchTerm) {
      updateParams({ search: localSearch, page: 1 });
    }
  };

  const loadMatchedOffers = async () => {
    setMatchedLoading(true);
    setMatchedError(null);

    try {
      const response = await api.get('/offers/matchedOffers');
      setMatchedOffers(
        Array.isArray(response.data?.matchedOffers)
          ? response.data.matchedOffers.slice(0, 3)
          : [],
      );
      setMatchedMessage(response.data?.message || '');
      setMatchedLoaded(true);
    } catch (requestError) {
      setMatchedError(
        requestError.response?.data?.message ||
          requestError.response?.data?.error ||
          'Nie udało się pobrać dopasowanych ofert. Spróbuj ponownie.',
      );
    } finally {
      setMatchedLoading(false);
      setMatchedOpen(true);
    }
  };

  const handleMatchedButtonClick = () => {
    if (!matchedLoaded) {
      if (!matchedLoading) {
        loadMatchedOffers();
      }
      return;
    }

    setMatchedOpen((open) => !open);
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get(`/offers?page=${page}&search=${encodeURIComponent(searchTerm)}`)
      .then(res => {
        if (res.data && Array.isArray(res.data.offers)) {
          setOffers(res.data.offers);
          setTotalPages(res.data.totalPages || 1);
        } else {
          setOffers([]);
          setTotalPages(1);
        }
      })
      .catch(() => setError('Nie udało się załadować ofert'))
      .finally(() => setLoading(false));
  }, [page, searchTerm, reloadToken]);

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (!user?.id) {
      setHasCv(false);
      return undefined;
    }

    let active = true;
    const userId = user.id;

    api.get(`/profile/getProfile/${userId}`)
      .then((response) => {
        const profile = response.data?.message?.[0];
        if (!profile) {
          throw new Error('Nie udało się pobrać profilu użytkownika');
        }

        const cvUrl = typeof profile.cv_url === 'string' ? profile.cv_url.trim() : '';
        if (active) {
          setHasCv(Boolean(cvUrl));
          setUser((currentUser) =>
            currentUser?.id === userId
              ? { ...currentUser, cv_url: cvUrl || null }
              : currentUser,
          );
        }
      })
      .catch((requestError) => {
        console.error('Nie udało się sprawdzić CV użytkownika:', requestError);
        if (active) {
          setHasCv((currentValue) =>
            currentValue || Boolean(getSavedCvMeta(userId)?.url),
          );
        }
      });

    return () => {
      active = false;
    };
  }, [user?.id, setUser]);

  return (
    <div className="min-h-screen p-8 font-sans w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-12 text-black">Przeglądaj ogłoszenia</h1>

      <section className="mb-8 overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 via-white to-fuchsia-50 shadow-sm">
        {hasCv ? (
          <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
            <span className="flex min-w-0 items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <Sparkles size={22} />
              </span>
              <span>
                <span className="block font-bold text-zinc-900">
                  Oferty dopasowane do Twojego CV
                </span>
                <span className="mt-1 block text-sm text-zinc-600">
                  Analiza CV może potrwać około 30 sekund.
                </span>
              </span>
            </span>
            <button
              type="button"
              onClick={handleMatchedButtonClick}
              aria-expanded={matchedOpen}
              aria-busy={matchedLoading}
              disabled={matchedLoading}
              className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-100 disabled:cursor-not-allowed"
            >
              <span>
                {matchedLoading
                  ? 'Analizuję CV...'
                  : matchedLoaded
                    ? matchedOpen
                      ? 'Ukryj'
                      : 'Pokaż oferty'
                    : matchedError
                      ? 'Spróbuj ponownie'
                      : 'Załaduj dopasowane oferty'}
              </span>
              {matchedLoading ? (
                <LoaderCircle size={20} className="animate-spin" />
              ) : !matchedLoaded ? (
                <ArrowRight size={20} />
              ) : (
                <ChevronDown
                  size={20}
                  className={`transition-transform ${matchedOpen ? 'rotate-180' : ''}`}
                />
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
            <span className="flex min-w-0 items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <Sparkles size={22} />
              </span>
              <span>
                <span className="block font-bold text-zinc-900">
                  Uzyskaj personalne rekomendacje ofert
                </span>
                <span className="mt-1 block text-sm text-zinc-600">
                  Stwórz CV lub wgraj gotowy plik PDF na swoim profilu, aby zobaczyć dopasowane oferty.
                </span>
              </span>
            </span>
            <Link
              to={`/profile/${user.id}`}
              className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-violet-100 px-4 py-2.5 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-200"
            >
              <span>Dodaj CV</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {hasCv && matchedOpen && (matchedLoaded || matchedError) && (
          <div className="border-t border-violet-100 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
            <Listings
              offers={matchedOffers}
              error={matchedError}
              onRetry={loadMatchedOffers}
              emptyTitle="Nie znaleziono dopasowanych ofert"
              emptyDescription={
                matchedMessage ||
                'Nie znaleziono ofert dopasowanych do Twojego CV.'
              }
            />
          </div>
        )}
      </section>

      <div className="my-6">
        <div className="flex gap-3">
          <div className="relative grow flex gap-3">
            <div className="relative grow">
              <input
                type="text"
                placeholder="Szukaj po nazwie lub technologii..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && commitSearch()}
                onBlur={commitSearch}
                className="w-full bg-[#070709] text-white border border-[#1f1f22] rounded-2xl px-6 py-4 outline-none transition-all duration-200 focus:border-[#3f3f46] focus:bg-[#111114] placeholder:text-zinc-500 font-medium"
              />
              {localSearch && (
                <button 
                  onClick={() => { setLocalSearch(''); setSearchParams({}); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-white text-[10px] cursor-pointer font-bold uppercase tracking-widest"
                >
                  Reset
                </button>
              )}
            </div>
            
            <button 
              onClick={commitSearch}
              className="h-[58px] aspect-square flex items-center justify-center bg-[#070709] border border-[#1f1f22] rounded-2xl text-zinc-400 hover:text-white hover:border-[#3f3f46] transition-all duration-200 cursor-pointer"
            >
              <Search size={20} />
            </button>
          </div>

          <div className="relative group">
            <button
              disabled
              className="h-[58px] aspect-square flex items-center justify-center bg-[#070709] border border-[#1f1f22] rounded-2xl text-zinc-500  cursor-not-allowed transition-all duration-200"
            >
              <SlidersHorizontal size={18} />
              <DollarSign
                size={12}
                className="absolute top-2.5 right-2.5 text-zinc-500"
              />
            </button>
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#18181b] text-zinc-300 text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[#3f3f46] shadow-2xl z-50">
              Funkcja Premium
            </span>
          </div>
        </div>
      </div>

      {!loading && !error && totalPages > 1 && (
        <BrowsePagination
          page={page}
          totalPages={totalPages}
          loading={loading}
          updateParams={updateParams}
          className="my-5"
        />
      )}

      <Listings 
        offers={offers} 
        loading={loading} 
        error={error}
        searchTerm={searchTerm}
        onReset={() => {
          setLocalSearch("");
          setSearchParams({});
        }}
        onRetry={() => setReloadToken((token) => token + 1)}
        onTagClick={(tag) => updateParams({ search: tag, page: 1 })}
      />

      {!loading && !error && totalPages > 1 && offers?.length > 3 && (
        <BrowsePagination
          page={page}
          totalPages={totalPages}
          loading={loading}
          updateParams={updateParams}
          className="my-3"
        />
      )}
    </div>
  );
};

export default Browse;