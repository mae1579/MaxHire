import React from 'react';
import { Link } from 'react-router-dom';
import formatUpdater from '../../utils/DateFormatter';
import { parseTechTags } from '../../utils/parseJsonField';

const Listing = ({ id, title, company, description, tech, updated, photo: image, onTagClick }) => {
  const techTags = parseTechTags(tech);

  const finalImgSrc = (image && image.trim() !== "") ? image : "/favicon.svg";

  return (
    <div className="bg-[#070709] p-5 rounded-2xl flex flex-row gap-5 border border-[#1f1f22] mb-4 transition-all duration-200 hover:bg-[#18181b] hover:border-[#3f3f46]">
      <div className="w-14 h-14 bg-white rounded-xl shrink-0 flex items-center justify-center shadow-sm overflow-hidden">
        <img 
          src={finalImgSrc} 
          alt={company} 
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/favicon.svg";
            e.target.classList.add('invert', 'p-2');
          }}
          className={`w-full h-full object-cover ${finalImgSrc === "/favicon.svg" ? 'invert p-2' : ''}`}
        />
      </div>

      <div className="grow flex flex-col min-w-0">
        <div className="flex flex-col mb-1">
          <h3 className="w-fit">
            <Link 
              to={`/offer/${id}`} 
              className="text-[#ffffff] text-lg font-bold hover:text-blue-400 transition-colors truncate block"
            >
              {title}
            </Link>
          </h3>
          <span className="text-[#a1a1aa] text-sm font-medium">{company}</span>
        </div>
        
        <p className="text-[#d4d4d8] text-sm mb-4 line-clamp-1 font-normal leading-relaxed">
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          {Array.isArray(techTags) && techTags.map((tag, tagIndex) => (
            <button 
              key={tagIndex} 
              onClick={() => onTagClick(tag)}
              className="text-[10px] font-bold text-[#f4f4f5] bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46] px-3 py-1 rounded-md uppercase tracking-widest transition-all cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end justify-start pt-1 min-w-[120px]">
        <span className="text-[#71717a] text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
          {formatUpdater(updated)}
        </span>
      </div>
    </div>
  );
};

const StatusCard = ({ title, description, actionLabel, onAction }) => (
  <div className="bg-[#070709] border border-[#1f1f22] rounded-2xl px-6 py-12 text-center">
    <p className="text-white font-bold text-lg">{title}</p>
    {description && (
      <p className="text-zinc-500 text-sm mt-2 max-w-md mx-auto">{description}</p>
    )}
    {onAction && actionLabel && (
      <button
        type="button"
        onClick={onAction}
        className="mt-6 px-5 py-2.5 rounded-xl bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

const Listings = ({
  offers,
  loading,
  error,
  onTagClick,
  searchTerm = "",
  onReset,
  onRetry,
  emptyTitle,
  emptyDescription,
}) => {
  if (loading) {
    return (
      <div className="text-zinc-500 text-center py-10 animate-pulse font-medium uppercase tracking-widest text-xs">
        Wczytywanie ofert...
      </div>
    );
  }

  if (error) {
    return (
      <StatusCard
        title="Nie udało się załadować"
        description={error}
        actionLabel={onRetry ? "Spróbuj ponownie" : undefined}
        onAction={onRetry}
      />
    );
  }

  if (!offers || offers.length === 0) {
    const query = (searchTerm || "").trim();
    const title = emptyTitle || (query ? "Nic nie pasuje" : "Brak ogłoszeń");
    const description =
      emptyDescription ||
      (query
        ? `Żadne ogłoszenie nie zawiera „${query}”. Zmień frazę albo wyczyść wyszukiwanie.`
        : "Na tej stronie nie ma zleceń. Sprawdź później albo dodaj własne.");

    return (
      <StatusCard
        title={title}
        description={description}
        actionLabel={query && onReset ? "Wyczyść wyszukiwanie" : undefined}
        onAction={query && onReset ? onReset : undefined}
      />
    );
  }

  return (
    <div className="flex flex-col">
      {offers.map((listing, index) => (
        <Listing 
          key={listing.id || index} 
          {...listing} 
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
};

export default Listings;