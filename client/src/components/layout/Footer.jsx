import React from 'react';
import { Link } from 'react-router-dom';
import ContributorsEgg from './ContributorsEgg';

const Footer = () => {
  return (
    <footer className="w-full py-10 flex flex-col items-center justify-center bg-zinc-950 text-gray-400 border-t border-zinc-800 text-[12px]">
      <div className="flex flex-col items-center gap-2">
        <p>© {new Date().getFullYear()} MaxHire. Wszystkie prawa zastrzeżone.</p>
        <div className="flex gap-4 text-zinc-500">
          <a href="" className="hover:text-white transition-colors">Prywatność</a>
          <Link to="/regulamin" className="hover:text-white transition-colors">Regulamin</Link>
        </div>
        <ContributorsEgg />
      </div>
    </footer>
  );
};

export default Footer;