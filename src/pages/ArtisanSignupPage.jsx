import React, { useRef, useState } from "react";
import {
  Select,
  SelectItem,
  Input,
  Button,
  Progress,
  Card,
  CardHeader,
  CardBody,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import {
  FaCamera,
  FaEyeSlash,
  FaRegEye,
  FaRegEyeSlash,
  FaUpload,
} from "react-icons/fa";

const ArtisanSignup = () => {
  const [step, setStep] = useState(1);

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [isVisible1, setIsVisible1] = React.useState(false);
  const toggleVisibility1 = () => setIsVisible1(!isVisible1);

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
    streetAddress: "",
    city: "",
    state: "",
    country: "Nigeria",

    // Professional Information
    jobType: "",
    jobCategories: [{ jobCategory: "", skills: [""] }],
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
  });

  const [errors, setErrors] = useState({});
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

  const triggerImageUpload = () => {
    fileInputRef.current.click();
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleNestedChange = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleAddSkill = (categoryIndex) => {
    setFormData((prev) => {
      const newJobCategories = [...prev.jobCategories];
      newJobCategories[categoryIndex].skills.push("");
      return { ...prev, jobCategories: newJobCategories };
    });
  };

  const handleAddJobCategory = () => {
    setFormData((prev) => ({
      ...prev,
      jobCategories: [...prev.jobCategories, { jobCategory: "", skills: [""] }],
    }));
  };

  const validateStep = () => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        break;
      // Add validation for other steps
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep()) {
      // Submit form data to backend
      console.log("Form submitted:", formData);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Personal Information</h2>
            <div className="flex justify-center mb-6">
              <div
                className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={triggerImageUpload}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <FaCamera className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-500 mt-2">
                      Upload Photo
                    </span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {imagePreview && (
                  <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-lg">
                    <FaUpload className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="First Name"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1"
                />
                {errors.firstName && (
                  <span className="text-red-500 text-sm">
                    {errors.firstName}
                  </span>
                )}
              </div>

              <div>
                <Input
                  label="Last Name"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1"
                />
                {errors.lastName && (
                  <span className="text-red-500 text-sm">
                    {errors.lastName}
                  </span>
                )}
              </div>
            </div>

            <div>
              <Input
                label="Email"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>

            <div>
              <Select
                label="Gender"
                value={formData.gender}
                onChange={(e) =>
                  handleChange({
                    target: { name: "gender", value: e.target.value },
                  })
                }
                placeholder="Select Gender"
              >
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </Select>
              {errors.gender && (
                <span className="text-red-500 text-sm">{errors.gender}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="Password"
                  id="password"
                  name="password"
                  type={isVisible ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1"
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() => toggleVisibility()}
                      aria-label="toggle password visibility"
                    >
                      {isVisible ? (
                        <FaRegEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <FaRegEye className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password}
                  </span>
                )}
              </div>

              <div>
                <Input
                  label="Confirm Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  type={isVisible1 ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1"
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() => toggleVisibility1()}
                      aria-label="toggle password visibility"
                    >
                      {isVisible1 ? (
                        <FaRegEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <FaRegEye className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                />
                {errors.confirmPassword && (
                  <span className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Contact & Address</h2>
            <div>
              <Autocomplete
                items={[
                  { id: 1, label: "Lagos", value: "Lagos" },
                  { id: 2, label: "Abuja", value: "Abuja" },
                  { id: 3, label: "Kano", value: "Kano" },
                  { id: 4, label: "Ibadan", value: "Ibadan" },
                  { id: 5, label: "Port Harcourt", value: "Port Harcourt" },
                ]}
                label="State"
                placeholder="Select state"
                selectedKey={formData.state}
                onSelectionChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    state: value,
                  }));
                }}
              >
                {(item) => (
                  <AutocompleteItem key={item.id} value={item.value}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>
            <div>
              <Input
                label="City"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </div>
            <div>
              <Input
                label="Street Address"
                id="streetAddress"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                placeholder="Enter street address"
              />
            </div>
            <div>
              <Input
                label="country"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled
              />
            </div>

            {/* Add contact and address fields */}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Professional Information</h2>
            {/* Add professional information fields */}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Education</h2>
            {/* Add education fields */}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Work Experience</h2>
            {/* Add work experience fields */}
          </div>
        );

      default:
        return null;
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
          src="/Login.png"
          alt="Employee Login Illustration"
          className="w-full md:block hidden"
        />
      </div>
    </div>
  );
};

export default ArtisanSignup;
