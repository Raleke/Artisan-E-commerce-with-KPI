import React, { useEffect, useState } from "react";
import { toast } from "sonner"; // Import react-toastify
import { useNavigate } from "react-router"; // Import useNavigate from react-router-dom
import { FaEye, FaRegEyeSlash } from "react-icons/fa6";
import { Button, Card, Input, Link } from "@heroui/react";
// Reusable Form Component
const FormComponent = ({
  title,
  fields,
  onSubmit,
  submitButtonText,
  loading,
  isEmployer,
  isAdmin = false,
}) => {
  const navigate = useNavigate(); // Initialize the navigate function for routing
  const [passwordVisibility, setPasswordVisibility] = useState({});

  const toggleVisibility = (fieldName) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Collect form data
    const formData = Object.fromEntries(new FormData(e.target).entries());

    // Check for isRequired fields
    const missingFields = fields.filter(
      (field) => field.isRequired && !formData[field.name],
    );

    if (missingFields.length > 0) {
      // If there are missing isRequired fields, show a toast error
      toast.error(
        `Please fill out the required fields: ${missingFields
          .map((field) => field.label)
          .join(", ")}`,
      );
      return; // Don't proceed with form submission
    }

    // Proceed with the form submission if all required fields are filled
    onSubmit(formData);
  };

  // Navigate back to the onboarding screen
  const handleBackToOnboarding = () => {
    navigate("/onboarding/login"); // Replace with the correct path for your onboarding screen
  };

  return (
    <Card className="bg-transparent">
      <h4 className="font-bold text-xl text-center">{title}</h4>
      <form
        className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 px-4 py-2 lg:px-8 lg:py-4"
        onSubmit={handleSubmit}
      >
        <div className="mb-1 flex flex-col gap-6">
          {fields.map((field, index) => (
            <div key={index} className="flex flex-col">
              {field.type === "password" && (
                <div className="flex justify-end">
                  {!isAdmin && (
                    <Link
                      href={
                        isEmployer
                          ? "/forgot-password/employer"
                          : "/forgot-password/artisan"
                      }
                      className="text-primary hover:underline text-sm"
                    >
                      Forgot Password?
                    </Link>
                  )}
                </div>
              )}
              <Input
                label={field.label}
                type={passwordVisibility[field.name] ? "text" : field.type}
                name={field.name}
                size="lg"
                placeholder={field.placeholder}
                endContent={
                  field.type === "password" && (
                    <Button
                      className="focus:outline-none"
                      type="button"
                      isIconOnly
                      onClick={() => toggleVisibility(field.name)}
                      aria-label="toggle password visibility"
                    >
                      {passwordVisibility[field.name] ? (
                        <FaRegEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <FaEye className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </Button>
                  )
                }
              />
            </div>
          ))}
        </div>
        <Button
          type="submit"
          color="primary"
          className="mt-6"
          isLoading={loading}
          fullWidth
        >
          {submitButtonText}
        </Button>
      </form>

      <span
        className="mt-4 text-sm absolute cursor-pointer top-[100%] right-[5%] lg:right-[-30%]"
        onClick={handleBackToOnboarding}
      >
        Back
      </span>
    </Card>
  );
};

export default FormComponent;
