import React, { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ email: user?.email ?? '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Wiadomość wysłana!");
    setFormData({ email: user?.email ?? '', message: '' });
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full px-6">
      <div className="flex flex-col w-full max-w-2xl p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl text-zinc-100">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Skontaktuj się z nami
          </h2>
          <p className="text-zinc-400 mt-2 text-sm">
            Napisz do nas, odpowiemy najszybciej jak to możliwe.
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-sm font-semibold text-zinc-200">
              Email
            </label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="twój@email.example"
              className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
            />
          </div>

          <div className="relative">
            <label className="block mb-2 text-sm font-semibold text-zinc-200">
              Wiadomość
            </label>
            <textarea
              required
              rows="8"
              maxLength="1000"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="W czym możemy pomóc?"
              className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all resize-none"
            />
            <span className="absolute bottom-3 right-3 text-[10px] font-medium text-zinc-600 uppercase tracking-wider bg-zinc-900/80 px-1 rounded">
              {formData.message.length} / 1000
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 font-bold text-zinc-950 bg-zinc-100 rounded-lg hover:bg-white hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-100 focus:ring-offset-zinc-900 transition-all shadow-lg cursor-pointer"
          >
            Wyślij wiadomość
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-zinc-800/50 flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          <div className="flex flex-col">
            <span className="text-zinc-500">Email</span>
            <span className="normal-case tracking-normal text-zinc-400 text-xs font-medium">support@maxhire.example</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-zinc-500">Lokalizacja</span>
            <span className="normal-case tracking-normal text-zinc-400 text-xs font-medium">Warszawa, PL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;