import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import formatUpdater from '../utils/DateFormatter';

const Listing = ({ id, title, company, description, tech = [], updated, onTagClick }) => {
  const normalizedTags = typeof tech === 'string' ? JSON.parse(tech) : tech;
  const tagList = Array.isArray(normalizedTags) ? normalizedTags : [];
  
  return (
    <div className="bg-[#070709] p-5 rounded-2xl flex flex-row gap-5 border border-[#1f1f22] mb-4 transition-all duration-200 hover:bg-[#18181b] hover:border-[#3f3f46]">
      <div className="w-14 h-14 bg-white rounded-xl shrink-0 flex items-center justify-center shadow-sm overflow-hidden">
        <img 
          src="/favicon.svg" 
          alt="Logo" 
          className="w-10 h-10 object-contain invert select-none"
        />
      </div>

      <div className="grow flex flex-col min-w-0">
        <div className="flex flex-col mb-1">
          <h3 className="w-fit">
            <Link 
              to={`/offers/${id}`} 
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
          {tagList.map((tag, tagIndex) => (
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

      <div className="hidden sm:flex flex-col items-end justify-start pt-1 min-w-[90px]">
        <span className="text-[#71717a] text-[10px] font-bold uppercase tracking-wider">
          {formatUpdater(updated)}
        </span>
      </div>
    </div>
  );
}

const Listings = () => {
  const [offers, setOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/offers')
      .then(res => res.ok ? res.json() : Promise.reject(new Error(`${res.status} ${res.statusText}`)))
      .then(data => setOffers(Array.isArray(data) ? data : []))
      .catch(() => setError('Nie udało się załadować ofert'))
      .finally(() => setLoading(false));
  }, []);

  const handleTagClick = (tag) => setSearchTerm(tag);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 min-h-screen">
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Szukaj ofert"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#070709] text-white border border-[#1f1f22] rounded-2xl px-6 py-4 outline-none transition-all duration-200 focus:border-[#3f3f46] focus:bg-[#111114] placeholder:text-[#71717a] font-medium"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-white text-[10px] font-bold uppercase tracking-widest"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        {loading && <div className="text-white text-center py-10 animate-pulse font-medium">Wczytywanie ofert...</div>}
        {error && <div className="text-red-400 text-center py-10 font-medium">{error}</div>}
        
        {!loading && !error && offers.map((listing, index) => (
          <Listing 
            key={listing.id ?? index} 
            {...listing} 
            onTagClick={handleTagClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Listings;