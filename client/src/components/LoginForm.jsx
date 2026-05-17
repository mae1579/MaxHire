import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_API_URL || "";

const LoginForm = ({ onSwitchToRegister }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { token } = useParams();

  useEffect(() => {
    if (token && token.length > 0) {
      handleTokenLogin(token);
    }
  }, [token]);

  const handleTokenLogin = async (token) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/backend/login/email/login`,
        {
          token,
        },
        {
          withCredentials: true,
        }
      );
      setUser(
        response.data.user || {
          email: response.data.email,
          name: response.data.name,
        }
      );
      toast.success("Zalogowano pomyślnie");
      navigate("/browse");
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Błąd logowania";
      toast.error(message);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isEmailValid) {
      toast.error("Nieprawidłowy adres email");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/backend/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      setUser(
        response.data.user || {
          email,
          name: response.data.name,
        }
      );
      toast.success("Zalogowano pomyślnie");
      navigate("/");
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Błąd logowania";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (!isEmailValid) {
      toast.error("Nieprawidłowy adres email");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/backend/login/email/loginUser`,
        {
          email,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Link logowania wysłany na email");
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Błąd wysyłania emaila";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full max-w-md p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl text-zinc-100">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
        Witaj ponownie
      </h2>
      <p className="text-zinc-400 mt-2 text-sm">
        Zaloguj się na swoje konto.
      </p>

      <form className="mt-8" onSubmit={handleLogin}>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-semibold text-zinc-200"
        >
          Email
        </label>
        <input
          disabled={isLoading}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          id="email"
          name="email"
          value={email}
          placeholder="nazwa@przyklad.pl"
          className="w-full p-3 mb-4 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all disabled:opacity-50"
        />

        <label
          htmlFor="password"
          className="block mb-2 text-sm font-semibold text-zinc-200"
        >
          Hasło
        </label>
        <input
          disabled={isLoading}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          id="password"
          name="password"
          placeholder="Hasło"
          value={password}
          className="w-full p-3 mb-4 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all disabled:opacity-50"
        />

        <div className="text-right mb-8">
          <Link
            to={"/recover"}
            className="text-sm font-medium text-zinc-400 hover:text-white underline-offset-4 hover:underline transition-colors cursor-pointer"
          >
            Zapomniałeś hasła?
          </Link>
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="w-full py-3.5 font-bold text-zinc-950 bg-zinc-100 rounded-lg hover:bg-white hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-100 focus:ring-offset-zinc-900 transition-all shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? "Logowanie..." : "Zaloguj się"}
        </button>

        <button
          disabled={isLoading}
          type="button"
          onClick={handleEmailLogin}
          className="w-full mt-3 py-3.5 font-bold text-white bg-zinc-700 rounded-lg hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-600 focus:ring-offset-zinc-900 transition-all shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Wysyłanie..." : "Zaloguj się emailem"}
        </button>

        <p className="text-center text-zinc-500 mt-8 text-sm">
          Nie masz konta?{" "}
          <button
            disabled={isLoading}
            type="button"
            className="text-white font-semibold hover:underline cursor-pointer disabled:opacity-50"
            onClick={onSwitchToRegister}
          >
            Zarejestruj się
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;