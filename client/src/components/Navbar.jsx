import { LogIn, LogOut, MenuIcon, PlusSquare } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/logo.svg";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      setDropdownOpen(false);
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
          to="/browse"
          className="cursor-pointer text-zinc-400 hover:text-white transition-colors font-medium"
        >
          Przeglądaj
        </Link>
        <Link
          to="/contact"
          className="cursor-pointer text-zinc-400 hover:text-white transition-colors font-medium"
        >
          Kontakt
        </Link>
      </div>
      <div className="hidden sm:flex items-center relative" ref={dropdownRef}>
        {user ? (
          <div className="relative flex items-center gap-3 ml-4">
            <span className="text-zinc-300 font-medium text-sm">
              {user.name}
            </span>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center focus:outline-none cursor-pointer"
            >
              <img
                src="/favicon.svg"
                alt="Profile"
                className="h-9 w-9 rounded-full border border-zinc-700 hover:border-zinc-400 transition-all object-cover cursor-pointer"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl py-2 z-50">
                <button
                  onClick={() => {}}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer"
                >
                  <PlusSquare className="h-4 w-4" />
                  Stwórz post
                </button>
                <div className="h-px bg-zinc-800 my-1 mx-2"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Wyloguj
                </button>
              </div>
            )}
          </div>
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
          to="/browse"
          onClick={() => setOpen(false)}
          className="block text-zinc-300 hover:text-white font-medium py-2"
        >
          Przeglądaj
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
          <>
            <div className="px-2 py-2 text-zinc-400 font-semibold uppercase text-xs tracking-wider">
              Użytkownik: {user.name}
            </div>
            <button className="w-full flex items-center gap-2 text-zinc-300 py-2 cursor-pointer">
              <PlusSquare className="h-5 w-5" /> Stwórz post
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-3 font-bold text-zinc-950 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-all shadow-lg flex justify-center items-center gap-2 cursor-pointer"
            >
              Wyloguj
              <LogOut className="h-4 w-4" />
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="w-full"
            onClick={() => setOpen(false)}
          >
            <button className="w-full py-3 font-bold text-zinc-950 bg-zinc-100 rounded-lg hover:bg-white transition-all shadow-lg cursor-pointer">
              Zaloguj się
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;