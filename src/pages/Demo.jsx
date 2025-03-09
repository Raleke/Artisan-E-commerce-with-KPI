import { useState, useRef } from "react";
import signupImage from "../../assets/signup.png";
import { UseArtisanSignup } from "../../hooks/useAuth";
import ProfessionalInfoStep from "../components/forms/ArtisnProfessionalInfoFormStep";
import EducationStep from "../components/forms/ArtisanEducationFormStep";
import WorkExperienceStep from "../components/forms/ArtisanWorkExperienceFormStep";
import useArtisanForm from "../hooks/useArtisanForm";
import { Button, Card, CardBody, CardHeader, Progress } from "@heroui/react";

const ArtisanSignup = () => {
  const {
    step,
    setStep,
    totalSteps,
    formData,
    setFormData,
    validateStep,
    errors,
    setErrors,
  } = useArtisanForm();
  const progress = (step / totalSteps) * 100;
  const signupMutation = UseArtisanSignup();
  // Refs and state for file uploads
  const profileInputRef = useRef(null);
  const cvInputRef = useRef(null);

  // State for file previews
  const [imagePreview, setImagePreview] = useState(null);
  const [cvFileName, setCvFileName] = useState(null);

  // Password visibility toggles
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [isVisible1, setIsVisible1] = useState(false);
  const toggleVisibility1 = () => setIsVisible1(!isVisible1);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          image: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFileName(file.name);
      setFormData((prev) => ({
        ...prev,
        cv: file,
      }));
    }
  };

  const triggerImageUpload = () => {
    profileInputRef.current.click();
  };

  const triggerCvUpload = () => {
    cvInputRef.current.click();
  };

  // Fixed handleChange with correct regex order
  const handleChange = (e) => {
    const { name, value } = e.target;
    const nestedArrayMatch = name.match(/(\w+)\[(\d+)\]\.(\w+)\[(\d+)\]/);

    if (nestedArrayMatch) {
      // Handle nested arrays (skills)
    } else {
      const arrayMatch = name.match(/(\w+)\[(\d+)\]\.(\w+)/);
      if (arrayMatch) {
        // Handle regular array properties
      } else {
        // Handle simple properties
      }
    }
  };

  const handleAddSkill = (categoryIndex) => {
    setFormData((prev) => {
      const updatedCategories = [...prev.jobCategories];
      updatedCategories[categoryIndex].skills.push("");
      return { ...prev, jobCategories: updatedCategories };
    });
  };

  const renderStep = () => {
    return (
      <>
        {/* Progress and form rendering */}
        {step === 1 && <ProfessionalInfoStep {...formData,errors,handleChange,imagePreview,triggerImageUpload,profileInputRef,isVisible,toggleVisibility,isVisible1,toggleVisibility1,handleImageUpload} />}
        {step === 2 && <AddressStep {...formData,errors,handleChange,setFormData} />}
        {step === 3 && <ProfessionalInfoStep {...formData,errors,handleChange,handleAddSkill,handleAddJobCategory} />}
        {step === 4 && <EducationStep {...formData,errors,handleChange} />}
        {step === 5 && <WorkExperienceStep {...formData,errors,handleChange,cvFileName,triggerCvUpload,cvInputRef,handleCvUpload} />}
        {/* Navigation buttons */}
      </>
    );
  };
  const handleAddJobCategory = () => {
    setFormData((prev) => ({
      ...prev,
      jobCategories: [...prev.jobCategories, { jobCategory: "", skills: [""] }],
    }));
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep()) {
      try {
        // Create a new FormData object for multipart/form-data
        const submissionData = new FormData();

        // Add all the basic form fields
        for (const [key, value] of Object.entries(formData)) {
          if (
            key !== "image" &&
            key !== "cv" &&
            key !== "jobCategories" &&
            key !== "education" &&
            key !== "workExperience"
          ) {
            submissionData.append(key, value);
          }
        }

        // Add files
        if (formData.image) {
          submissionData.append("image", formData.image);
        }

        if (formData.cv) {
          submissionData.append("cv", formData.cv);
        }

        // Add complex objects as JSON strings
        submissionData.append(
          "jobCategories",
          JSON.stringify(formData.jobCategories),
        );
        submissionData.append("education", JSON.stringify(formData.education));
        submissionData.append(
          "workExperience",
          JSON.stringify(formData.workExperience),
        );

        // Submit the form
        signupMutation.mutate(submissionData);
      } catch (error) {
        console.error("Error preparing form data:", error);
        setErrors({
          ...errors,
          serverError: "An error occurred. Please try again.",
        });
      }
    }
  };
  return (
    <div className="items-center flex flex-col justify-center md:justify-normal md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 py-6 sm:mt-12">
        <Card className="w-full max-w-md">
          <CardHeader className="flex-col gap-y-2">
            <h3 className="text-center text-2xl font-semibold leading-none tracking-tight">
              Artisan Registration
            </h3>
            <Progress value={progress} className="w-full" />
            <p className="text-center text-sm text-gray-600">
              Step {step} of {totalSteps}
            </p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderStep()}

              <div className="flex justify-between">
                {step > 1 && (
                  <Button
                    type="button"
                    color="primary"
                    variant="bordered"
                    onClick={handleBack}
                  >
                    Previous
                  </Button>
                )}
                {step < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    color="primary"
                    className="ml-auto"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    color="primary"
                    className="ml-auto"
                    disabled={!formData.termsAccepted}
                  >
                    Create Account
                  </Button>
                )}
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <img
          src={signupImage}
          alt="Employee Login Illustration"
          className="w-full md:block hidden"
        />
      </div>
    </div>
  );
};

export default ArtisanSignup;
