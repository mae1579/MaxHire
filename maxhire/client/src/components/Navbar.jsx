import { LogIn, LogOut, MenuIcon } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/logo.svg";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
      toast.success("Wylogowano");
      navigate("/login");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Błąd wylogowania");
      setUser(null);
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-zinc-800 bg-zinc-950 relative transition-all text-zinc-100 z-50">
      <Link to="/">
        <img src={logo} alt="logo" className="h-8 w-auto" />
      </Link>

      <div className="hidden sm:flex items-center gap-8">
        <Link
          to="/"
          className="text-zinc-400 hover:text-white transition-colors font-medium cursor-pointer"
        >
          Strona główna
        </Link>
        <Link
          to="/contact"
          className="cursor-pointer text-zinc-400 hover:text-white transition-colors font-medium"
        >
          Kontakt
        </Link>
      </div>
      <div className="hidden sm:flex items-center">
        {user ? (
          <button
            onClick={handleLogout}
            className="flex justify-center items-center gap-1 px-6 py-2.5 font-bold text-zinc-950 bg-zinc-100 rounded-lg hover:bg-zinc-200 hover:scale-[1.01] transition-all shadow-lg cursor-pointer"
          >
            Wyloguj
            <LogOut className="h-4 w-4 ml-1" />
          </button>
        ) : (
          <Link to="/login">
            <button className="flex justify-center items-center gap-1 px-6 py-2.5 font-bold text-zinc-950 bg-zinc-100 rounded-lg hover:bg-white hover:scale-[1.01] transition-all shadow-lg cursor-pointer">
              Zaloguj się
              <LogIn className="h-4 w-4" />
            </button>
          </Link>
        )}
      </div>

      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        className="sm:hidden text-zinc-400 hover:text-white"
      >
        <MenuIcon className="w-6 h-6 text-white" />
      </button>

      <div
        className={`
          absolute top-full left-0 w-full bg-zinc-950 border-b border-zinc-800 shadow-xl py-6 flex flex-col items-start gap-4 px-6 text-sm md:hidden -z-10
          transition-all duration-300 ease-in-out origin-top
          ${
            open
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-4"
          }
        `}
      >
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="block text-zinc-300 hover:text-white font-medium py-2"
        >
          Strona główna
        </Link>
        <Link
          to="/contact"
          onClick={() => setOpen(false)}
          className="block text-zinc-300 hover:text-white font-medium py-2"
        >
          Kontakt
        </Link>

        <div className="w-full h-px bg-zinc-800 my-2"></div>
        {user ? (
          <button
            onClick={handleLogout}
            className="w-full py-3 font-bold text-zinc-950 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-all shadow-lg flex justify-center items-center gap-2"
          >
            Wyloguj
            <LogOut className="h-4 w-4" />
          </button>
        ) : (
          <Link
            to="/login"
            className="w-full"
            onClick={() => setOpen(false)}
          >
            <button className="w-full py-3 font-bold text-zinc-950 bg-zinc-100 rounded-lg hover:bg-white transition-all shadow-lg">
              Zaloguj się
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
