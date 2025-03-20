import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  Progress,
} from "@heroui/react";
import signupImage from "../assets/signup.jpg";
import { useEmployerSignup } from "../adapters/Requests";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const SignupForm = () => {
  const apiClientPrivate = useAxiosPrivate();
  const [step, setStep] = useState(1);
  const signupMutation = useEmployerSignup();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedCountryName, setSelectedCountryName] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [selectedStateName, setSelectedStateName] = useState("");
  const [selectedCityCode, setSelectedCityCode] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyNum: "",
    country: "",
    state: "",
    city: "",
    termsAndConditions: false,
  });

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        const res = await apiClientPrivate.get("/countries");
        setCountries(res.data);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
      setIsLoading(false);
    };
    fetchCountries();
  }, [apiClientPrivate]);

  const fetchStates = async (countryCode) => {
    setIsLoading(true);
    try {
      const res = await apiClientPrivate.get(
        `/countries/states?countryCode=${countryCode}`,
      );
      setStates(res.data);
    } catch (err) {
      console.error("Error fetching states:", err);
    }
    setIsLoading(false);
  };

  const fetchCities = async (stateCode) => {
    setIsLoading(true);
    try {
      const res = await apiClientPrivate.get(
        `/states/cities?stateCode=${stateCode}`,
      );
      setCities(res.data);
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
    setIsLoading(false);
  };

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep = () => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(formData.email))
          newErrors.email = "Please enter a valid email address";

        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 8)
          newErrors.password = "Password should be at least 8 characters";

        if (!formData.confirmPassword)
          newErrors.confirmPassword = "Please confirm your password";
        else if (formData.password !== formData.confirmPassword)
          newErrors.confirmPassword = "Passwords do not match";
        break;

      case 2:
        if (!formData.companyName)
          newErrors.companyName = "Company name is required";
        if (!formData.companyNum)
          newErrors.companyNum = "Company number is required";
        else if (!/^\d+$/.test(formData.companyNum))
          newErrors.companyNum = "Company number should only contain digits";
        break;

      case 3:
        if (!selectedCountryName) newErrors.country = "Country is required";
        if (!selectedStateName) newErrors.state = "State is required";
        if (!selectedCityName) newErrors.city = "City is required";
        break;

      case 4:
        if (!formData.termsAndConditions)
          newErrors.termsAndConditions =
            "You must accept the terms and conditions";
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

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep()) {
      return;
    }
    console.log("Form submitted:", formData);
    try {
      const submissionData = new FormData();
      for (const [key, value] of Object.entries(formData)) {
        if (key !== "image") {
          submissionData.append(key, value);
        }
      }
      signupMutation.mutate(submissionData);
    } catch (err) {
      console.log(err);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Input
                label="Email"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>
            <div>
              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password}</span>
              )}
            </div>
            <div>
              <Input
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Input
                label="Company Name"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Enter company name"
                required
              />
              {errors.companyName && (
                <span className="text-red-500 text-sm">
                  {errors.companyName}
                </span>
              )}
            </div>
            <div>
              <Input
                label="Company Number"
                id="companyNum"
                name="companyNum"
                value={formData.companyNum}
                onChange={handleInputChange}
                placeholder="Enter company number"
                required
              />
              {errors.companyNum && (
                <span className="text-red-500 text-sm">
                  {errors.companyNum}
                </span>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Autocomplete
                items={countries}
                label="Country"
                placeholder="Select country"
                selectedKey={selectedCountryCode}
                onSelectionChange={(value) => {
                  const selectedCountry = countries.find(
                    (country) => country.country_code === value,
                  );
                  setSelectedCountryCode(value);
                  setSelectedCountryName(selectedCountry?.name);
                  setFormData((prev) => ({
                    ...prev,
                    country: selectedCountry?.name || "",
                    state: "",
                    city: "",
                  }));
                  fetchStates(value);
                }}
                isLoading={isLoading}
              >
                {(item) => (
                  <AutocompleteItem
                    key={item.country_code}
                    value={item.country_code}
                  >
                    {item.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
              {errors.country && (
                <span className="text-red-500 text-sm">{errors.country}</span>
              )}
            </div>
            <div>
              <Autocomplete
                items={states}
                label="State"
                placeholder="Select state"
                selectedKey={selectedStateCode}
                onSelectionChange={(value) => {
                  const selectedState = states.find(
                    (state) => state.state_code === value,
                  );
                  setSelectedStateCode(value);
                  setSelectedStateName(selectedState?.name);
                  setFormData((prev) => ({
                    ...prev,
                    state: selectedState?.name || "",
                    city: "",
                  }));
                  fetchCities(value);
                }}
                isLoading={isLoading}
              >
                {(item) => (
                  <AutocompleteItem
                    key={item.state_code}
                    value={item.state_code}
                  >
                    {item.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
              {errors.state && (
                <span className="text-red-500 text-sm">{errors.state}</span>
              )}
            </div>
            <div>
              <Autocomplete
                items={cities}
                label="City"
                placeholder="Select city"
                selectedKey={selectedCityCode}
                onSelectionChange={(value) => {
                  const selectedCity = cities.find((city) => city.id === value);
                  setSelectedCityCode(value);
                  setSelectedCityName(selectedCity?.name);
                  setFormData((prev) => ({
                    ...prev,
                    city: selectedCity?.name || "",
                  }));
                }}
                isLoading={isLoading}
              >
                {(item) => (
                  <AutocompleteItem key={item.id} value={item.id}>
                    {item.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
              {errors.city && (
                <span className="text-red-500 text-sm">{errors.city}</span>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600 mb-4">Terms and Conditions</p>
              <div className="max-h-48 overflow-y-auto text-sm text-gray-600">
                By using ArtisanOps, you agree to the following terms: Our
                platform connects clients with artisans based on location and
                specified needs. We are not responsible for the quality of work,
                fulfillment of services, or any agreements made between clients
                and artisans. Users must provide accurate information when
                creating profiles or listings. We do not guarantee matches or
                availability of artisans in specific areas. Personal data
                provided will be used solely for matching purposes and will not
                be shared with third parties without consent. We reserve the
                right to remove any user or listing that violates our guidelines
                or terms. Use of our platform is at your own risk, and we are
                not liable for any disputes, damages, or losses arising from
                connections made through our service. Terms are subject to
                change without prior notice.
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                isSelected={formData.termsAndConditions}
                onValueChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    termsAndConditions: checked,
                  }))
                }
                label="I accept the terms and conditions"
              />
              {errors.termsAndConditions && (
                <span className="text-red-500 text-sm">
                  {errors.termsAndConditions}
                </span>
              )}
            </div>
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
              Create Account
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
                    disabled={!formData.termsAndConditions}
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

export default SignupForm;
