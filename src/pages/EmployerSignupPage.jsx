import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Select,
  SelectItem,
  Checkbox,
  Progress,
} from "@heroui/react";
import signupImage from "../assets/signup.jpg";
import { useEmployerSignup } from "../adapters/Requests";

const SignupForm = () => {
  const [step, setStep] = useState(1);
  const signupMutation = useEmployerSignup();
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

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
    console.log("sik");
    // Handle form submission
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
            </div>
            <div>
              <Input
                label="Passowrd"
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <div>
              <Input
                label="Confirm Passowrd"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
              />
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
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Select
                label="Country"
                placeholder="Select country"
                name="country"
                selectedKeys={[formData.country]}
                onChange={(e) =>
                  handleInputChange({
                    target: { name: "country", value: e.target.value },
                  })
                }
              >
                <SelectItem key="nigeria">Nigeria</SelectItem>
                <SelectItem key="ghana">Ghana</SelectItem>
                <SelectItem key="kenya">Kenya</SelectItem>
              </Select>
            </div>
            <div>
              <Select
                label="State"
                placeholder="Select state"
                name="state"
                selectedKeys={[formData.state]}
                onChange={(e) =>
                  handleInputChange({
                    target: { name: "state", value: e.target.value },
                  })
                }
              >
                <SelectItem key="lagos">Lagos</SelectItem>
                <SelectItem key="abuja">Abuja</SelectItem>
                <SelectItem key="kano">Kano</SelectItem>
              </Select>
            </div>
            <div>
              <Select
                label="City"
                name="city"
                selectedKeys={[formData.city]}
                onChange={(e) =>
                  handleInputChange({
                    target: { name: "city", value: e.target.value },
                  })
                }
                placeholder="Select city"
              >
                <SelectItem key="ikeja">Ikeja</SelectItem>
                <SelectItem key="victoria-island">Victoria Island</SelectItem>
                <SelectItem key="lekki">Lekki</SelectItem>
              </Select>
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
            <h3 className="text-center text-2xl font-semibold leading-none tracking-tight'">
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
