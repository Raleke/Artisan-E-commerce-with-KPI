import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { FaCamera, FaEdit, FaCheckCircle, FaTimes } from "react-icons/fa";

const ArtisanProfile = ({ isOwnProfile = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    profession: "Carpenter",
    experience: "15",
    email: "john.doe@example.com",
    phone: "+234 800 123 4567",
    companyName: "JD Woodworks",
    country: "nigeria",
    state: "lagos",
    city: "ikeja",
    bio: "Master carpenter with over 15 years of experience specializing in custom furniture and home renovations. Known for attention to detail and quality craftsmanship.",
    hourlyRate: "5000",
    availability: "weekdays",
    skills: ["Furniture Making", "Wood Carving", "Cabinet Installation"],
    completedJobs: 127,
    rating: 4.8,
  });

  const [editedData, setEditedData] = useState(profileData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setProfileData(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader className="relative">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
                <img
                  src="/api/placeholder/128/128"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {isOwnProfile && (
                  <div className="absolute bottom-0 w-full bg-black/50 py-2 flex justify-center">
                    <FaCamera className="w-5 h-5 text-white cursor-pointer" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{profileData.fullName}</h1>
                {isOwnProfile && !isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                  >
                    <FaEdit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
              <p className="text-lg text-gray-600">{profileData.profession}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center">
                  <FaCheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  {profileData.completedJobs} Jobs Completed
                </span>
                <span className="flex items-center">
                  ⭐ {profileData.rating}/5.0
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardBody className="space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="fullName"
                  value={editedData.fullName}
                  onChange={handleInputChange}
                />
                <Input
                  label="Profession"
                  name="profession"
                  value={editedData.profession}
                  onChange={handleInputChange}
                />
                <Input
                  label="Experience (years)"
                  name="experience"
                  type="number"
                  value={editedData.experience}
                  onChange={handleInputChange}
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={editedData.phone}
                  onChange={handleInputChange}
                />
                <Input
                  label="Hourly Rate (₦)"
                  name="hourlyRate"
                  type="number"
                  value={editedData.hourlyRate}
                  onChange={handleInputChange}
                />
                <Select
                  label="Availability"
                  name="availability"
                  value={editedData.availability}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: { name: "availability", value },
                    })
                  }
                >
                  <SelectItem value="weekdays">Weekdays Only</SelectItem>
                  <SelectItem value="weekends">Weekends Only</SelectItem>
                  <SelectItem value="all">All Week</SelectItem>
                </Select>
              </div>
              <div>
                <Textarea
                  label="Bio"
                  name="bio"
                  value={editedData.bio}
                  onChange={handleInputChange}
                  className="w-full min-h-[100px] p-2 border rounded-md"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  <FaTimes className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <FaCheckCircle className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Location
                  </h3>
                  <p className="mt-1">
                    {profileData.city}, {profileData.state},{" "}
                    {profileData.country}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                  <p className="mt-1">{profileData.email}</p>
                  <p>{profileData.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Experience
                  </h3>
                  <p className="mt-1">{profileData.experience} years</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Rate</h3>
                  <p className="mt-1">₦{profileData.hourlyRate}/hour</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">About</h3>
                <p className="mt-1">{profileData.bio}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Skills</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ArtisanProfile;
