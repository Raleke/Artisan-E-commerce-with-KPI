import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Chip,
  Spinner,
  Link,
  Button,
} from "@heroui/react";
import {
  FaCamera,
  FaCheckCircle,
  FaDownload,
  FaEdit,
  FaMailchimp,
  FaStar,
} from "react-icons/fa";
import profilePic from "../assets/IMG_6048.jpeg";
import resume from "../assets/resume.pdf";
import { useGetArtisanFullDetails } from "../adapters/Requests";
import useAuth from "../hooks/useAuth";
import { MdOutlineWhatsapp } from "react-icons/md";
import { FaEnvelope } from "react-icons/fa6";
import { useNavigate } from "react-router";

const ArtisanProfile = ({ artisanId, isOwnProfile = true }) => {
  console.log(artisanId);
  const { user } = useAuth();
  const { isLoading, data } = useGetArtisanFullDetails(artisanId || user.id);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    fullName: "",
    profession: "",
    experience: "",
    email: "",
    phone: "",
    companyName: "",
    country: "",
    state: "",
    city: "",
    bio: "",
    hourlyRate: "",
    whatsappNumber: "",
    availability: "",
    skills: [],
    completedJobs: 0,
    rating: 0,
    education: [],
    workExperience: [],
  });

  useEffect(() => {
    if (data) {
      const transformedData = {
        fullName: `${data.artisan.firstName} ${data.artisan.lastName}`,
        profession: data.artisan.jobCategories[0]?.jobCategory || "",
        experience: data.artisan.yearsOfExperience?.toString() || "",
        email: data.artisan.email,
        phone: data.artisan.phoneNumber,
        whatsappNumber: data.artisan.whatsappNumber,
        companyName: data.artisan.workExperience?.companyName || "",
        country: data.artisan.country,
        state: data.artisan.state,
        city: data.artisan.city,
        bio: data.artisan.artisanDescription,
        hourlyRate: "", // Assuming no hourly rate provided in API
        availability: data.artisan.jobType, // Assuming no availability provided in API
        skills: data.artisan.jobCategories[0]?.skills || [],
        completedJobs: 0, // Assuming no completed jobs provided in API
        rating: 0, // Assuming no rating provided in API
        education: data.artisan.education.details
          ? [
              {
                id: 1,
                institution: data.artisan.education.level,
                qualification: data.artisan.education.details.certObtained,
                year: data.artisan.education.details.gradYear,
                description: data.artisan.education.details.course,
              },
            ]
          : [],
        workExperience: data.artisan.workExperience.hasExperience
          ? [
              {
                companyName: data.artisan.workExperience.details.companyName,
                jobTitle: data.artisan.workExperience.details.role,
                startDate: data.artisan.workExperience.details.startYear,
                endDate: data.artisan.workExperience.details.endYear,
              },
            ]
          : [],
      };

      setProfileData(transformedData);
    }
  }, [data]);

  if (isLoading)
    return (
      <div>
        <Spinner />
      </div>
    );

  return (
    <div className="container min-h-[80vh] flex justify-center items-center mx-auto p-4">
      <Card className="w-full">
        <CardHeader className="relative flex flex-col md:flex-row">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden relative">
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold mr-4">
                  {profileData.fullName}
                </h1>
                {isOwnProfile && (
                  <Button
                    onPress={() => navigate("/artisan/edit-profile")}
                    variant="ghost"
                    startContent={<FaEdit />}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
              <p className="text-lg text-gray-600">{profileData.profession}</p>
              <div className="hidden md:flex items-center gap-4 mt-2">
                <span className="flex items-center">
                  <FaCheckCircle className="w-4 h-4 text-success-500 mr-1" />
                  {profileData.completedJobs} Jobs Completed
                </span>
                <span className="flex items-center gap-2">
                  <FaStar className="text-yellow-400 h-4 w-4 " />
                  {profileData.rating}/5.0
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2 md:hidden">
            <span className="flex items-center">
              <FaCheckCircle className="w-4 h-4 text-success-500 mr-1" />
              {profileData.completedJobs} Jobs Completed
            </span>
            <span className="flex items-center">
              ⭐ {profileData.rating}/5.0
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
                <p className="mt-1 flex flex-row items-center gap-4">
                  <FaEnvelope className="h-4 w-4 " />
                  {profileData.email}
                </p>
                <Link
                  href={`https://wa.me/${profileData.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p className="flex flex-row gap-4 items-center">
                    <MdOutlineWhatsapp className="text-green-400 h-4 w-4" />

                    {profileData.phone}
                  </p>
                </Link>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Experience
                </h3>
                <p className="mt-1">{profileData.experience} years</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Availability
                </h3>
                <p className="mt-1">{profileData.availability}</p>
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
                  <Chip key={index} className="">
                    {skill}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">CV</h3>
              <a
                href={resume}
                download
                className="text-primary-500 hover:underline mt-1 flex flex-row items-center gap-2"
              >
                <FaDownload />
                Download CV
              </a>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">
                Education
              </h3>
              <div className="space-y-4">
                {profileData.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{edu.qualification}</h4>
                        <p className="text-gray-600 dark:text-gray-50">
                          {edu.institution}
                        </p>
                      </div>
                      <span className="text-gray-500 dark:text-gray-100">
                        {edu.year}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600 dark:text-gray-50">
                      {edu.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">
                Work Experience
              </h3>
              <div className="space-y-4">
                {profileData.workExperience.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{exp.jobTitle}</h4>
                        <p className="text-gray-600 dark:text-gray-50">
                          {exp.companyName}
                        </p>
                      </div>
                      <span className="text-gray-500 dark:text-gray-100">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
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

export default ArtisanProfile;
