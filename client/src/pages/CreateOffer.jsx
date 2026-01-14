import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';

const AddOfferForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    tech: '',
    github: '',
    linkedin: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const linksObj = {};
    if (formData.github.trim()) linksObj.Github = formData.github.trim();
    if (formData.linkedin.trim()) linksObj.Linkedin = formData.linkedin.trim();

    const payload = {
      title: formData.title,
      company: formData.company || "", 
      description: formData.description,
      tech: JSON.stringify(formData.tech.split(',').map(item => item.trim()).filter(i => i !== "")),
      links: JSON.stringify(linksObj)
    };

    try {
      await axios.post('http://localhost:3000/addOffer', payload, { withCredentials: true });
      
      toast.success("Ogłoszenie zostało dodane!");

      if (user?.id) {
        navigate(`/profile/${user.id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Wystąpił błąd podczas dodawania ogłoszenia.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-4 font-sans antialiased">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white w-full max-w-2xl rounded-4xl p-8 md:p-10 shadow-xl shadow-black/3 border border-gray-100"
      >
        <h2 className="text-2xl font-semibold text-black mb-8 tracking-tight">Nowe ogłoszenie</h2>

        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Podstawowe informacje</p>
          <div className="space-y-3">
            <input 
              name="title" 
              placeholder="Tytuł ogłoszenia" 
              maxLength={40}
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none transition-all text-sm font-normal" 
            />
            <input 
              name="company" 
              placeholder="Firma (opcjonalnie)" 
              maxLength={40}
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none transition-all text-sm font-normal" 
            />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Opis stanowiska</p>
          <textarea 
            name="description" 
            placeholder="Napisz coś o projekcie..." 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none transition-all h-64 resize-none text-sm font-normal leading-relaxed" 
          />
        </div>

        <div className="mb-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Technologie i Linki</p>
          <div className="space-y-3">
            <input 
              name="tech" 
              placeholder="Stack technologiczny (koniecznie po przecinku, np. React, Node.js)" 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none transition-all text-sm font-normal" 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input 
                name="github" 
                placeholder="Link GitHub (opcjonalnie)" 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none transition-all text-sm font-normal" 
              />
              <input 
                name="linkedin" 
                placeholder="Link LinkedIn (opcjonalnie)" 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none transition-all text-sm font-normal" 
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-black/10 uppercase tracking-widest text-xs"
        >
          Opublikuj
        </button>
      </form>
    </div>
  );
};

export default AddOfferForm;