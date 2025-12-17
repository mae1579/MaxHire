import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const LoginForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const API_URL = "http://localhost:3000";

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_URL}/register`,
        {
          name,
          surname,
          email,
          password,
          role: "user",
          phone: "",
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Utworzono konto!");
      setIsRegistering(false);
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message ||
        "Błąd przy rejestracji";
      toast.error(message);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Zalogowano pomyślnie");
      setUser(
        response.data.user || {
          email,
          name: response.data.name,
        }
      );
      navigate("/");
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message || "Błąd logowania";
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full max-w-md p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl text-zinc-100">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
        {isRegistering
          ? "Zarejestruj się"
          : "Witaj ponownie"}
      </h2>
      <p className="text-zinc-400 mt-2 text-sm">
        {isRegistering
          ? "Utwórz nowe konto, aby zacząć."
          : "Zaloguj się na swoje konto."}
      </p>

      {!isRegistering ? (
        <form className="mt-8" onSubmit={handleLogin}>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-semibold text-zinc-200"
          >
            Email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            name="email"
            value={email}
            placeholder="nazwa@przyklad.pl"
            className="w-full p-3 mb-4 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
          />

          <label
            htmlFor="password"
            className="block mb-2 text-sm font-semibold text-zinc-200"
          >
            Hasło
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            name="password"
            placeholder="Hasło"
            value={password}
            className="w-full p-3 mb-4 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
          />

          <div className="text-right mb-8">
            <Link
              to={"/contact"}
              className="text-sm font-medium text-zinc-400 hover:text-white underline-offset-4 hover:underline transition-colors"
            >
              Zapomniałeś hasła?
            </Link>
          </div>

          <button
            onClick={() => navigate("/")}
            type="submit"
            className="w-full py-3.5 font-bold text-zinc-950 bg-zinc-100 rounded-lg hover:bg-white hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-100 focus:ring-offset-zinc-900 transition-all shadow-lg"
          >
            Zaloguj się
          </button>

          <p className="text-center text-zinc-500 mt-8 text-sm">
            Nie masz konta?{" "}
            <button
              type="button"
              className="text-white font-semibold hover:underline"
              onClick={() => setIsRegistering(true)}
            >
              Zarejestruj się
            </button>
          </p>
        </form>
      ) : (
        <form className="mt-8" onSubmit={handleRegister}>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-semibold text-zinc-200"
              >
                Imię
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                type="text"
                id="name"
                name="name"
                placeholder="Jan"
                value={name}
                required
                className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="surname"
                className="block mb-2 text-sm font-semibold text-zinc-200"
              >
                Nazwisko
              </label>
              <input
                onChange={(e) => setSurname(e.target.value)}
                type="text"
                id="surname"
                name="surname"
                placeholder="Kowalski"
                value={surname}
                required
                className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
              />
            </div>
          </div>

          <label
            htmlFor="email"
            className="block mb-2 text-sm font-semibold text-zinc-200"
          >
            Email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            id="email"
            name="email"
            type="email"
            placeholder="nazwa@przyklad.pl"
            required
            className="w-full p-3 mb-4 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
          />

          <label
            htmlFor="password"
            className="block mb-2 text-sm font-semibold text-zinc-200"
          >
            Hasło
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            id="password"
            name="password"
            type="password"
            placeholder="Stwórz silne hasło"
            required
            className="w-full p-3 mb-8 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
          />

          <button
            type="submit"
            className="w-full py-3.5 font-bold text-zinc-950 bg-zinc-100 rounded-lg hover:bg-white hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-100 focus:ring-offset-zinc-900 transition-all shadow-lg"
          >
            Utwórz konto
          </button>

          <p className="text-center text-zinc-500 mt-8 text-sm">
            Masz już konto?{" "}
            <button
              type="button"
              className="text-white font-semibold hover:underline"
              onClick={() => setIsRegistering(false)}
            >
              Zaloguj się
            </button>
          </p>
        </form>
      )}
    </div>
  );
};

export default LoginForm;
