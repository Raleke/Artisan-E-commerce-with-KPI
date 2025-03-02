import { useState } from "react";
import { useNavigate } from "react-router";
import loginImage from "../assets/login.jpg";
import FormComponent from "../components/forms/FormComponent";
import { useEmployerLogin } from "../adapters/Requests";

const EmployerLoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const loginEmploye = useEmployerLogin();

  const handleLogin = async (formData) => {
    try {
      setLoading(true);
      await loginEmploye.mutateAsync(formData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
    <div className="items-center flex flex-col justify-center md:justify-normal md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 py-6 sm:mt-12">
        <FormComponent
          title="Employer Login"
          fields={fields}
          onSubmit={handleLogin}
          submitButtonText="Login"
          loading={loading}
        />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <img
          src={loginImage}
          alt="Employee Login Illustration"
          className="w-full md:block hidden"
        />
      </div>
    </div>
  );
};

export default EmployerLoginPage;
