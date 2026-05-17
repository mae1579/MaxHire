import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isRegistering, setIsRegistering] = useState(
    searchParams.get("mode") === "register"
  );

  const handleSwitchToRegister = () => {
    setIsRegistering(true);
    setSearchParams({ mode: "register" });
  };

  const handleSwitchToLogin = () => {
    setIsRegistering(false);
    setSearchParams({});
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex justify-center items-center w-full px-4 py-8">
      {isRegistering ? (
        <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
      ) : (
        <LoginForm onSwitchToRegister={handleSwitchToRegister} />
      )}
    </div>
  );
};

export default Login;
