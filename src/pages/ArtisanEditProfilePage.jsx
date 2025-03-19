import React, { useState, useEffect } from "react";
import { usePatchArtisanProfile } from "../adapters/Requests";
import { useGetArtisanFullDetails } from "../adapters/Requests";
import { Input, Button, Select, SelectItem } from "@heroui/react";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";

const ArtisanEditProfilePage = () => {
  const { user } = useAuth();
  const { isLoading, data } = useGetArtisanFullDetails(user.id);
  const patchArtisanProfile = usePatchArtisanProfile(user.id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    whatsappNumber: "",
    jobType: "",
    description: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        whatsappNumber: data.artisan.whatsappNumber,
        jobType: data.artisan.jobType,
        description: data.artisan.artisanDescription,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    patchArtisanProfile.mutate(formData, {
      onSuccess: () => {
        navigate("/artisan/profile");
      },
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Account Details</h2>
        <p>
          <strong>Name:</strong> {data.artisan.firstName}{" "}
          {data.artisan.lastName}
        </p>
        <p>
          <strong>Email:</strong> {data.artisan.email}
        </p>
        <p>
          <strong>Phone Number:</strong> {data.artisan.phoneNumber}
        </p>
        <p>
          <strong>City:</strong> {data.artisan.city}
        </p>
        <p>
          <strong>State:</strong> {data.artisan.state}
        </p>
        <p>
          <strong>Country:</strong> {data.artisan.country}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="WhatsApp Phone Number"
            name="whatsappNumber"
            value={formData.whatsappNumber}
            onChange={handleChange}
            placeholder="Enter WhatsApp phone number"
          />
        </div>
        <div>
          <Select
            label="Job Type"
            name="jobType"
            selectedKeys={[formData.jobType]}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "jobType",
                  value: e.target.value,
                },
              })
            }
            placeholder="Select job type"
          >
            <SelectItem key="Full-Time" value="Full-time">
              Full-Time
            </SelectItem>
            <SelectItem key="Contract" value="Contract">
              Contract
            </SelectItem>
          </Select>
        </div>
        <div>
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" color="primary">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ArtisanEditProfilePage;
