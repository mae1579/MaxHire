import React, { useEffect, useState } from 'react';
import formatUpdater from '../utils/DateFormatter';

const Listing = ({ title, company, description, tech = [], updated }) => {
  const normalizedTags = typeof tech === 'string' ? JSON.parse(tech) : tech;
  const tagList = Array.isArray(normalizedTags) ? normalizedTags : [];
  
  return (
    <div className="group bg-[#1e1e1e] hover:bg-[#252525] transition-all duration-200 p-6 rounded-3xl flex flex-col sm:flex-row gap-5 border border-[#333333] hover:border-[#444444] cursor-pointer mb-5 shadow-2xl text-left">
      <div className="w-16 h-16 bg-white rounded-2xl shrink-0 flex items-center justify-center shadow-lg">
        <span className="text-black text-[10px] font-black">MaxHire</span>
      </div>

      <div className="grow flex flex-col justify-center">
        <div className="flex flex-col mb-1">
          <h3 className="text-white text-xl font-bold tracking-tight group-hover:text-white transition-colors">
            {title}
          </h3>
          <span className="text-gray-300 text-sm font-medium">{company}</span>
        </div>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-1 font-normal leading-relaxed">
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          {tagList.map((tag, tagIndex) => (
            <span key={tagIndex} className="text-[10px] font-bold text-white bg-[#333333] border border-[#444444] px-4 py-1.5 rounded-full uppercase tracking-widest group-hover:bg-[#444444] transition-colors">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-start sm:items-end justify-start sm:pt-1 min-w-[120px]">
        <span className="text-gray-400 text-[11px] font-bold line-clamp-1 uppercase tracking-wider">
          {formatUpdater(updated)}
        </span>
      </div>
    </div>
  );
}

const Listings = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/offers')
      .then(res => res.ok ? res.json() : Promise.reject(new Error(`${res.status} ${res.statusText}`)))
      .then(data => setOffers(Array.isArray(data) ? data : []))
      .catch(err => setError('Nie udało się załadować ofert'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full lg:w-[70%] mx-auto px-6 py-12">
      <div className="flex flex-col">
        {loading && <div className="text-gray-300">Ładowanie ofert</div>}
        {error && <div className="text-red-400">{error}</div>}
        {!loading && !error && offers.map((listing, index) => (
          <Listing key={listing.id ?? index} {...listing} />
        ))}
      </div>
    </div>
  );
};

export default Listings;