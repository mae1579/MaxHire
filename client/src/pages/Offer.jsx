import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import NotFound from "./NotFound";
import { ArrowLeft, ExternalLink, Globe, Github, Linkedin, Mail, User, Phone } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import MarkdownDescription from "../components/offers/MarkdownDescription";
import { parseLinks, parseTechTags } from "../utils/parseJsonField";
import { isSafeHttpUrl } from "../utils/safeUrl";

const Offer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuth();
  const [offerResult, setOfferResult] = useState({ id: null, offer: null, error: null });
  const [revealedPhoneOfferId, setRevealedPhoneOfferId] = useState(null);

  const currentOfferResult = offerResult.id === id ? offerResult : null;
  const offer = currentOfferResult?.offer;
  const error = currentOfferResult?.error;
  const loading = !currentOfferResult;
  const showPhone = revealedPhoneOfferId === id;

  const isOwner = loggedInUser && String(loggedInUser.id) === String(offer?.user_id);
  const isAdmin = loggedInUser && String(loggedInUser.role).toLowerCase() === "admin";

  useEffect(() => {
    let isCurrent = true;

    api.get(`/offer/getOffer/${id}`)
      .then(res => {
        const data = res.data.message;
        const offerData = Array.isArray(data) && data.length > 0 ? data[0] : null;
        if (isCurrent) setOfferResult({ id, offer: offerData, error: null });
      })
      .catch(() => {
        if (isCurrent) {
          setOfferResult({ id, offer: null, error: 'Nie udało się załadować oferty' });
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [id]);

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-20 text-black font-bold uppercase tracking-widest">Wczytywanie...</div>;
  if (error || !offer) {
    return (
      <NotFound
        title="Nie ma takiego ogłoszenia"
        description={error || "Oferta nie istnieje albo została usunięta."}
      />
    );
  }

  const techTags = parseTechTags(offer.tech);
  const links = parseLinks(offer.links);

  return (
    <div className="w-full min-h-screen bg-zinc-50 font-sans antialiased text-zinc-900">
      <div className="max-w-5xl mx-auto px-8 py-12">
        
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-zinc-500 transition-colors hover:bg-white hover:text-zinc-950 cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>Wróć</span>
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          <div className="space-y-6 lg:col-span-8">
            <header className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm sm:p-8">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 sm:h-20 sm:w-20">
                  {offer.photo ? (
                    <img
                      src={offer.photo}
                      alt={offer.company}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={32} className="text-black" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="break-words text-xl font-bold leading-tight tracking-tight text-zinc-950 sm:text-2xl">{offer.title}</h1>
                  {offer.company && <p className="mt-1 text-base font-medium text-zinc-500">{offer.company}</p>}
                </div>
              </div>
              {techTags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {techTags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <section className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm sm:p-8">
              <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                Opis stanowiska
              </h2>
              <div className="prose prose-base prose-zinc max-w-none text-base leading-7 prose-p:my-4 prose-li:my-1 prose-a:font-medium prose-a:text-blue-700 prose-img:my-5 prose-img:max-h-96 prose-img:rounded-xl">
                <MarkdownDescription>
                  {offer.description || ""}
                </MarkdownDescription>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4">
            <aside className="sticky top-8 space-y-4">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-7">
                <h3 className="mb-5 border-b border-zinc-100 pb-3 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Ogłoszeniodawca
                </h3>
                
                <Link 
                  to={`/profile/${offer.user_id}`} 
                  className="group mb-5 flex items-center gap-3 cursor-pointer"
                >
                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-50">
                    {offer.photo ? (
                      <img 
                        src={offer.photo} 
                        alt={`${offer.name} ${offer.surname}`} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={24} className="text-black" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900 underline-offset-4 group-hover:underline">
                      {offer.name} {offer.surname}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-zinc-500">Zobacz profil</p>
                  </div>
                </Link>

                <div className="flex flex-col gap-1">
                  {Object.entries(links)
                    .filter(([, url]) => isSafeHttpUrl(url))
                    .map(([name, url]) => {
                      const normalizedName = name.toLowerCase();
                      const LinkIcon = normalizedName === "github"
                        ? Github
                        : normalizedName === "linkedin"
                          ? Linkedin
                          : Globe;

                      return (
                        <a
                          key={name}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-950"
                        >
                          <div className="flex items-center gap-3">
                            <LinkIcon size={16} />
                            <span className="capitalize">{name}</span>
                          </div>
                          <ExternalLink size={14} className="opacity-40" />
                        </a>
                      );
                    })}
                  
                  <a href={`mailto:${offer.email}`} className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-950">
                    <div className="flex items-center gap-3">
                      <Mail size={16} />
                      <span>Email</span>
                    </div>
                    <ExternalLink size={14} className="opacity-40" />
                  </a>

                  {offer.phone && (
                    <div className="select-text">
                      {!showPhone ? (
                        <button 
                          onClick={() => setRevealedPhoneOfferId(id)}
                          className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-950 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <Phone size={16} />
                            <span>xxx-xxx-xxx</span>
                          </div>
                          <span className="text-[10px] uppercase tracking-tighter opacity-40 ">Pokaż</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600">
                          <Phone size={16} />
                          <span className="select-all cursor-text">{offer.phone}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {isOwner || isAdmin ? (
                <Link 
                  to={`/editOffer/${id}`}
                  className="flex w-full items-center justify-center rounded-xl bg-zinc-950 py-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 cursor-pointer"
                >
                  Edytuj ogłoszenie
                </Link>
              ) : (
                <a 
                  href={`mailto:${offer.email}?subject=Aplikacja: ${offer.title}`}
                  className="flex w-full items-center justify-center rounded-xl bg-zinc-950 py-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800"
                >
                  Aplikuj Teraz
                </a>
              )}
            </aside>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Offer;