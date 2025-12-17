import React from "react";
import LoginForm from "../components/LoginForm";

const Login = ({ setUser }) => {
  return (
    <div className="min-h-[calc(100vh-100px)] flex justify-center items-center w-full px-4 py-8">
      <LoginForm setUser={setUser} />
    </div>
  );
};

export default Login;
