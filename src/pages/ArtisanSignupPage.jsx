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
  Textarea,
} from "@heroui/react";
import {
  FaCamera,
  FaEyeSlash,
  FaRegEye,
  FaRegEyeSlash,
  FaUpload,
} from "react-icons/fa";
import signupImage from "../assets/signup.jpg";

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
        if (formData.education.level !== "No Education") {
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
            <div>
              <Input
                label="Job Type"
                id="jobType"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                placeholder="Enter job type"
              />
              {errors.jobType && (
                <span className="text-red-500 text-sm">{errors.jobType}</span>
              )}
            </div>
            <div>
              <Input
                label="Years of Experience"
                id="yearsOfExperience"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                placeholder="Enter years of experience"
              />
              {errors.yearsOfExperience && (
                <span className="text-red-500 text-sm">
                  {errors.yearsOfExperience}
                </span>
              )}
            </div>
            <div>
              <Textarea
                label="Artisan Description"
                id="artisanDescription"
                name="artisanDescription"
                value={formData.artisanDescription}
                onChange={handleChange}
                placeholder="Enter a brief description"
              />
              {errors.artisanDescription && (
                <span className="text-red-500 text-sm">
                  {errors.artisanDescription}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Job Categories</h3>
              {formData.jobCategories.map((category, index) => (
                <div key={index} className="mb-4">
                  <Input
                    label={`Job Category ${index + 1}`}
                    id={`jobCategory-${index}`}
                    name={`jobCategories[${index}].jobCategory`}
                    className="mb-2"
                    value={category.jobCategory}
                    onChange={handleChange}
                    placeholder="Enter job category"
                  />
                  {category.skills.map((skill, skillIndex) => (
                    <Input
                      key={skillIndex}
                      label={`Skill ${skillIndex + 1}`}
                      id={`skill-${index}-${skillIndex}`}
                      name={`jobCategories[${index}].skills[${skillIndex}]`}
                      value={skill}
                      className="mb-2"
                      onChange={handleChange}
                      placeholder="Enter skill"
                    />
                  ))}

                  <Button
                    type="button"
                    onClick={() => handleAddSkill(index)}
                    variant="flat"
                    color="secondary"
                  >
                    Add Skill
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={handleAddJobCategory}
                className=""
                variant="ghost"
                color="secondary"
              >
                Add Job Category
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Education</h2>
            <div>
              <Select
                label="Education Level"
                value={formData.education.level}
                onChange={(e) =>
                  handleChange({
                    target: { name: "education.level", value: e.target.value },
                  })
                }
                placeholder="Select education level"
              >
                <SelectItem value="No Education">No Education</SelectItem>
                <SelectItem value="Primary School">Primary School</SelectItem>
                <SelectItem value="Secondary School">
                  Secondary School
                </SelectItem>
                <SelectItem value="University">University</SelectItem>
                <SelectItem value="Technical School">
                  Technical School
                </SelectItem>
                <SelectItem value="College of Education">
                  College of Education
                </SelectItem>
                <SelectItem value="Polytechnic">Polytechnic</SelectItem>
              </Select>
              {errors.education?.level && (
                <span className="text-red-500 text-sm">
                  {errors.education.level}
                </span>
              )}
            </div>
            {formData.education.level !== "No Education" && (
              <>
                <div>
                  <Input
                    label="Course"
                    id="course"
                    name="education.details.course"
                    value={formData.education.details.course}
                    onChange={handleChange}
                    placeholder="Enter course"
                  />
                  {errors.education?.details?.course && (
                    <span className="text-red-500 text-sm">
                      {errors.education.details.course}
                    </span>
                  )}
                </div>
                <div>
                  <Input
                    label="Graduation Year"
                    id="gradYear"
                    name="education.details.gradYear"
                    value={formData.education.details.gradYear}
                    onChange={handleChange}
                    placeholder="Enter graduation year"
                  />
                  {errors.education?.details?.gradYear && (
                    <span className="text-red-500 text-sm">
                      {errors.education.details.gradYear}
                    </span>
                  )}
                </div>
                <div>
                  <Input
                    label="Certificate Obtained"
                    id="certObtained"
                    name="education.details.certObtained"
                    value={formData.education.details.certObtained}
                    onChange={handleChange}
                    placeholder="Enter certificate obtained"
                  />
                  {errors.education?.details?.certObtained && (
                    <span className="text-red-500 text-sm">
                      {errors.education.details.certObtained}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Work Experience</h2>
            <div>
              <Select
                label="Do you have work experience?"
                value={formData.workExperience.hasExperience}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "workExperience.hasExperience",
                      value: e.target.value,
                    },
                  })
                }
                placeholder="Select an option"
              >
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </Select>
              {errors.workExperience?.hasExperience && (
                <span className="text-red-500 text-sm">
                  {errors.workExperience.hasExperience}
                </span>
              )}
            </div>
            {formData.workExperience.hasExperience === "Yes" && (
              <>
                <div>
                  <Input
                    label="Company Name"
                    id="companyName"
                    name="workExperience.details.companyName"
                    value={formData.workExperience.details.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                  />
                  {errors.workExperience?.details?.companyName && (
                    <span className="text-red-500 text-sm">
                      {errors.workExperience.details.companyName}
                    </span>
                  )}
                </div>
                <div>
                  <Input
                    label="Role"
                    id="role"
                    name="workExperience.details.role"
                    value={formData.workExperience.details.role}
                    onChange={handleChange}
                    placeholder="Enter role"
                  />
                  {errors.workExperience?.details?.role && (
                    <span className="text-red-500 text-sm">
                      {errors.workExperience.details.role}
                    </span>
                  )}
                </div>
                <div>
                  <Input
                    label="Start Year"
                    id="startYear"
                    name="workExperience.details.startYear"
                    value={formData.workExperience.details.startYear}
                    onChange={handleChange}
                    placeholder="Enter start year"
                  />
                  {errors.workExperience?.details?.startYear && (
                    <span className="text-red-500 text-sm">
                      {errors.workExperience.details.startYear}
                    </span>
                  )}
                </div>
                <div>
                  <Input
                    label="End Year"
                    id="endYear"
                    name="workExperience.details.endYear"
                    value={formData.workExperience.details.endYear}
                    onChange={handleChange}
                    placeholder="Enter end year"
                  />
                  {errors.workExperience?.details?.endYear && (
                    <span className="text-red-500 text-sm">
                      {errors.workExperience.details.endYear}
                    </span>
                  )}
                </div>
              </>
            )}
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
          src={signupImage}
          alt="Employee Login Illustration"
          className="w-full md:block hidden"
        />
      </div>
    </div>
  );
};

export default ArtisanSignup;
