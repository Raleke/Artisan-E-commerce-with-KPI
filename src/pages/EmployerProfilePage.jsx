import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Spinner } from "@heroui/react";
import { FaCamera, FaCheckCircle, FaStar } from "react-icons/fa";
import { useGetEmployerProfile } from "../adapters/Requests";
import useAuth from "../hooks/useAuth";

const EmployerProfile = ({ isOwnProfile = true }) => {
  const { user } = useAuth();
  const { isLoading, data } = useGetEmployerProfile(user.id);
  const [profileData, setProfileData] = useState({
    email: "johndoe@gmail.com",
    companyName: "John Doe Inc.",
    companyNum: "1234567890",
    image: "",
    dateRegistered: "2021-09-01",
    country: "Nigeria",
    state: "Lagos",
    city: "Ikeja",
    rating: 4.5,
    numberOfReviews: 0,
    jobsPosted: [
      {
        _id: "1",
        jobTitle: "Software Developer",
        location: "Lagos, Nigeria",
        datePosted: "2021-09-01",
        skills: ["React", "Node.js", "MongoDB"],
      },
      {
        _id: "2",
        jobTitle: "UX Designer",
        location: "Lagos, Nigeria",
        datePosted: "2021-09-01",
        skills: ["Figma", "Adobe XD"],
      },
    ],
  });

  useEffect(() => {
    if (data) {
      const transformedData = {
        email: data.email || data._doc.email,
        companyName: data.CompanyName || data._doc.CompanyName,
        companyNum: data._doc.companyNum,
        image: data._doc.image || "",
        dateRegistered: new Date(data._doc.dateRegistered).toLocaleDateString(),
        country: data._doc.country,
        state: data._doc.state,
        city: data._doc.city,
        rating: data.reviewAvg || 0,
        numberOfReviews: data.no_of_rating || 0,
        jobsPosted:
          data.jobs?.map((job) => ({
            _id: job._id,
            jobTitle: job.jobTitle,
            location: job.location,
            datePosted: new Date(job.datePosted).toLocaleDateString(),
            skills: [job.requiredSkill].filter(Boolean),
          })) || [],
      };

      setProfileData(transformedData);
    }
  }, [data]);
  console.log(data);
  if (isLoading)
    return (
      <div>
        <Spinner />
      </div>
    );

  return (
    <div className="max-w-4xl min-h-[80vh] flex justify-center items-center mx-auto p-4">
      <Card className="w-full">
        <CardHeader className="relative flex flex-col md:flex-row">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden relative">
                <img
                  src={
                    profileData.image
                      ? `/api/images/${profileData.image}`
                      : "/api/placeholder/128/128"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {isOwnProfile && (
                  <div className="absolute inset-x-0 bottom-0 rounded-b-full bg-black/50 py-2 flex justify-center">
                    <FaCamera className="w-5 h-5 text-white cursor-pointer" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                  {profileData.companyName}
                </h1>
              </div>
              <p className="text-lg text-gray-600">{profileData.companyNum}</p>
              <div className="hidden md:flex items-center gap-4 mt-2">
                <span className="flex items-center gap-2">
                  <FaStar className="text-yellow-400 h-4 w-4 " />
                  {profileData.rating}/5.0 ({profileData.numberOfReviews}{" "}
                  rating)
                </span>
                <span className="flex items-center">
                  <FaCheckCircle className="w-4 h-4 text-success-500 mr-1" />
                  {profileData.jobsPosted.length} Jobs Posted
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2 md:hidden">
            <span className="flex items-center">
              ⭐ {profileData.rating}/5.0
            </span>
            <span className="flex items-center">
              <FaCheckCircle className="w-4 h-4 text-success-500 mr-1" />
              {profileData.jobsPosted.length} Jobs Posted
            </span>
          </div>
        </CardHeader>

        <CardBody className="space-y-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="mt-1">
                  {profileData.city}, {profileData.state}, {profileData.country}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                <p className="mt-1">{profileData.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Date Registered
                </h3>
                <p className="mt-1">{profileData.dateRegistered}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">
                Jobs Posted
              </h3>
              <div className="space-y-4">
                {profileData.jobsPosted.map((job) => (
                  <div
                    key={job._id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-gray-600 dark:text-gray-50">
                          {job.location}
                        </p>
                      </div>
                      <span className="text-gray-500 dark:text-gray-100">
                        {new Date(job.datePosted).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600 dark:text-gray-50">
                      {job.skills.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default EmployerProfile;
