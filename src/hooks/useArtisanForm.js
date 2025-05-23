import { useState } from "react";

const useArtisanForm = () => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const totalSteps = 5;
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    whatsappNumber: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    dob: "",

    // Address Information
    streetAddress: "ilisan",
    city: "",
    state: "",
    country: "Nigeria",

    // Professional Information
    jobType: "",
    jobCategories: [{ jobCategory: "", skills: [""] }],
    skills: "",
    yearsOfExperience: "",
    artisanDescription: "",

    // Education
    education: {
      level: "",
      details: {
        course: "",
        gradYear: "",
        certObtained: "",
      },
    },

    // Work Experience
    workExperience: {
      hasExperience: "",
      details: {
        companyName: "",
        role: "",
        startYear: "",
        endYear: "",
      },
    },

    // File uploads
    image: null,
    cv: null,

    // Terms acceptance
    termsAccepted: false,
  });

  const validateStep = () => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (formData.password.length < 8)
          newErrors.password = "Password should be at least 8 characters";
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        if (!formData.phoneNumber)
          newErrors.phoneNumber = "Phone number is required";

        if (!formData.whatsappNumber)
          newErrors.whatsappNumber = "WhatsApp number is required";
        if (!formData.dob) newErrors.dob = "Date of birth is required";
        break;

      case 2:
        if (!formData.state) newErrors.state = "State is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.streetAddress)
          newErrors.streetAddress = "Street address is required";
        break;

      case 3:
        if (!formData.jobType) newErrors.jobType = "Job type is required";
        if (!formData.yearsOfExperience)
          newErrors.yearsOfExperience = "Years of experience is required";
        if (!formData.artisanDescription)
          newErrors.artisanDescription = "Description is required";

        // Set skills string based on all skills in jobCategories
        const allSkills = formData.jobCategories.reduce((acc, category) => {
          return [
            ...acc,
            ...category.skills.filter((skill) => skill.trim() !== ""),
          ];
        }, []);

        setFormData((prev) => ({
          ...prev,
          skills: allSkills.join(","),
        }));

        formData.jobCategories.forEach((category, index) => {
          if (!category.jobCategory)
            newErrors[`jobCategory-${index}`] = "Job category is required";
          category.skills.forEach((skill, skillIndex) => {
            if (!skill)
              newErrors[`skill-${index}-${skillIndex}`] = "Skill is required";
          });
        });
        break;

      case 4:
        if (!formData.education.level)
          newErrors["education.level"] = "Education level is required";
        if (
          formData.education.level &&
          formData.education.level !== "No Education"
        ) {
          if (!formData.education.details.course)
            newErrors["education.details.course"] = "Course is required";
          if (!formData.education.details.gradYear)
            newErrors["education.details.gradYear"] =
              "Graduation year is required";
          if (!formData.education.details.certObtained)
            newErrors["education.details.certObtained"] =
              "Certificate obtained is required";
        }
        break;

      case 5:
        if (!formData.workExperience.hasExperience)
          newErrors["workExperience.hasExperience"] =
            "Work experience is required";
        if (formData.workExperience.hasExperience === "Yes") {
          if (!formData.workExperience.details.companyName)
            newErrors["workExperience.details.companyName"] =
              "Company name is required";
          if (!formData.workExperience.details.role)
            newErrors["workExperience.details.role"] = "Role is required";
          if (!formData.workExperience.details.startYear)
            newErrors["workExperience.details.startYear"] =
              "Start year is required";
          if (!formData.workExperience.details.endYear)
            newErrors["workExperience.details.endYear"] =
              "End year is required";
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    step,
    setStep,
    totalSteps,
    formData,
    setFormData,
    validateStep,
    errors,
    setErrors,
  };
};

export default useArtisanForm;
