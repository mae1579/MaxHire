import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Code2, 
  Briefcase, 
  Github, 
  Layers,
  LogIn,
  UserPlus,
  Terminal
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
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
          <Link 
            to="/login" 
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

      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-4 transition-colors group-hover:bg-purple-100">
              <Search className="text-purple-600" size={20} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-black">Przeglądaj zlecenia</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Szybki wgląd w aktualną listę projektów. Filtruj ogłoszenia według technologii i wymagań.
            </p>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4 transition-colors group-hover:bg-blue-100">
              <Terminal className="text-blue-600" size={20} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-black">Wymagany stack</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Każda oferta posiada jasną listę technologii, takich jak React, Node.js czy Docker.
            </p>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4 transition-colors group-hover:bg-green-100">
              <Briefcase className="text-green-600" size={20} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-black">Dodaj projekt</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Potrzebujesz pomocy przy projekcie? Opublikuj swoje ogłoszenie i znajdź odpowiedniego podwykonawcę.
            </p>
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
            {['React', 'Vite', 'Express.js', 'Node.js', 'JavaScript', 'Tailwind CSS', 'JWT'].map((tech) => (
              <div key={tech} className="px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-gray-600 text-xs flex items-center gap-1.5 transition-colors hover:bg-gray-100 hover:border-gray-200 cursor-default">
                <Code2 size={12} />
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-400 border-t border-gray-100 text-[12px]">
        <p>© {new Date().getFullYear()} MaxHire. Wszystkie prawa zastrzeżone.</p>
      </footer>

    </div>
  );
};

export default Home;