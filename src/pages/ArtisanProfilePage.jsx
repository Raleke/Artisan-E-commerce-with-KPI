import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Chip,
  Spinner,
  Link,
  Button,
  input,
} from "@heroui/react";
import {
  FaCamera,
  FaCheckCircle,
  FaDownload,
  FaEdit,
  FaMailchimp,
  FaStar,
} from "react-icons/fa";
import profilePic from "../assets/benson1.jpeg";
import resume from "../assets/resume.pdf";
import { useGetArtisanFullDetails } from "../adapters/Requests";
import useAuth from "../hooks/useAuth";
import { MdOutlineWhatsapp } from "react-icons/md";
import { FaEnvelope } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { apiClientPrivate } from "../adapters/api";

const formatPhoneNumber = (number) => {
  if (number.length === 11 && number.startsWith("0")) {
    return `+234${number.slice(1)}`;
  }
  return number;
};

const ArtisanProfile = ({
  artisanId,
  isOwnProfile = true,
  isCustomer = false,
}) => {
  console.log(artisanId);
  const { user } = useAuth();
  console.log(user);
  const handleWhatsAppClick = async (e) => {
    if (isCustomer) {
      e.preventDefault();
      try {
        // Send the special request
        await apiClientPrivate.post("/customer/contacted-artisan", {
          artisanId: profileData.id,
          customerId: user.id,
        });

        // Open WhatsApp link in a new tab
        window.open(
          `https://wa.me/${profileData.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`,
          "_blank",
        );
      } catch (error) {
        console.error("Error sending special request:", error);
      }
    }
  };

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
    console.log(data);
    if (data) {
      const transformedData = {
        id: data.artisan._doc._id,
        fullName: `${data.artisan._doc.firstName} ${data.artisan._doc.lastName}`,
        profession: data.artisan._doc.jobCategories[0]?.jobCategory || "",
        experience: data.artisan._doc.yearsOfExperience?.toString() || "",
        email: data.artisan._doc.email,
        phone: formatPhoneNumber(data.artisan._doc.phoneNumber),
        whatsappNumber: formatPhoneNumber(data.artisan._doc.whatsappNumber),
        companyName: data.artisan._doc.workExperience?.companyName || "",
        country: data.artisan._doc.country,
        state: data.artisan._doc.state,
        city: data.artisan._doc.city,
        bio: data.artisan._doc.artisanDescription,
        rating: data.artisan.reviewAvg || 0,
        numberOfReviews: data.artisan.no_of_rating || 0,
        hourlyRate: "", // Assuming no hourly rate provided in API
        availability: data.artisan._doc.jobType, // Assuming no availability provided in API
        skills: data.artisan._doc.jobCategories[0]?.skills || [],
        completedJobs: data.artisan.no_of_jobs_completed, // Assuming no completed jobs provided in API
        education: data.artisan._doc.education.details
          ? [
              {
                id: 1,
                institution: data.artisan._doc.education.level,
                qualification: data.artisan._doc.education.details.certObtained,
                year: data.artisan._doc.education.details.gradYear,
                description: data.artisan._doc.education.details.course,
              },
            ]
          : [],
        workExperience: data.artisan._doc.workExperience.hasExperience
          ? [
              {
                companyName:
                  data.artisan._doc.workExperience.details.companyName,
                jobTitle: data.artisan._doc.workExperience.details.role,
                startDate: data.artisan._doc.workExperience.details.startYear,
                endDate: data.artisan._doc.workExperience.details.endYear,
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

    

  const whatsappMessage = `Hello, I'm ${user?.name || "an Employer/Customer"} from Ambacht Casa Artiginale. I would like to contact you.`;

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
                  {profileData.rating.toFixed(1)}/5{" "}
                  {`(${profileData.numberOfReviews} rating)`}
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
              ⭐ {profileData.rating.toFixed(1)}/5{" "}
              {`(${profileData.numberOfReviews} rating)`}
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
                  href={`https://wa.me/${profileData.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                >
                  <p className="flex flex-row gap-4 items-center">
                    <MdOutlineWhatsapp className="text-green-400 h-4 w-4" />
                    {isCustomer ? "Contact Me" : profileData.phone}
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
