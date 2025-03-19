import React, { useState } from "react";
import { useNavigate } from "react-router";
import FormComponent from "../components/forms/FormComponent";
import loginImage from "../assets/login.jpg";
import { useArtisanLogin } from "../adapters/Requests";

const ArtisanLoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const loginArtisan = useArtisanLogin();
  const handleLogin = async (formData) => {
    try {
      setLoading(true);
      await loginArtisan.mutateAsync(formData);
      setLoading(false);
      // Wait for 2 seconds before navigating to the dashboard
      // navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      console.error("Login failed:", error);
      // toast.error("Login Failed: Invalid credentials");
    }
  };

  const fields = [
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Enter your email",
      isRequired: true,
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "Enter your password",
      isRequired: true,
    },
  ];

  return (
    <div className=" items-center  flex flex-col justify-center md:justify-normal md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 py-6 sm:mt-12">
        <FormComponent
          title="Artisan Login"
          fields={fields}
          onSubmit={handleLogin}
          submitButtonText="Login"
          loading={loading}
          isEmployer={false}
        />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <img
          src={loginImage}
          alt="Admin Login Illustration"
          className="w-full md:block hidden"
        />
      </div>
    </div>
  );
};

export default ArtisanLoginPage;
