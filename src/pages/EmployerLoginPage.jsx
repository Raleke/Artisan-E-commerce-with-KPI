import { useState } from "react";
import { useNavigate } from "react-router";
import loginImage from "../assets/login.jpg";
import FormComponent from "../components/forms/FormComponent";

const EmployerLoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (formData) => {
    try {
      setLoading(true);
      // const response = await loginEmployee({
      //   email: formData.email,
      //   password: formData.password,
      // });

      const username = formData.email.split("@")[0];

      // localStorage.setItem("token", response.data.access_token); // Save JWT token
      // localStorage.setItem("email", formData.email); // Save employee email
      // localStorage.setItem("username", username); // Save employee email
      // localStorage.setItem("role", "employee"); // Save role as employee
      //
      // // toast.success("Login Successful!");
      //
      // setLoading(false);
      // // Wait for 2 seconds before redirecting to the dashboard
      // navigate("/dashboard");
    } catch (error) {
      setLoading(false);
    }
  };

  const fields = [
    {
      label: "Email",
      name: "email",
      type: "text",
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
