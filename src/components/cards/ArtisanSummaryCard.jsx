import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Badge,
  Avatar,
} from "@heroui/react";
import { FaStar, FaMapMarkerAlt, FaPhone, FaClock } from "react-icons/fa";

const ArtisanSummaryCard = ({ profile, onViewDetails }) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4 flex justify-between">
        <div className="flex items-center space-x-4">
          <Avatar
            showFallback
            name={getInitials(profile.fullName)}
            className="h-12 w-12"
          />
          <div>
            <h3 className="font-semibold text-lg">{profile.fullName}</h3>
            <p className="text-muted-foreground">{profile.profession}</p>
          </div>
        </div>
        <div className="flex items-center">
          <FaStar className="h-4 w-4 text-yellow-400" />
          <span className="ml-1 font-medium">{profile.rating}</span>
        </div>
      </CardHeader>

      <CardBody className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {profile.skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <FaMapMarkerAlt className="h-4 w-4 mr-2" />
            <span>{`${profile.city}, ${profile.state}`}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <FaClock className="h-4 w-4 mr-2" />
            <span className="capitalize">{profile.availability}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <FaPhone className="h-4 w-4 mr-2" />
            <span>{profile.phone}</span>
          </div>
        </div>

        <div className="pt-2 space-y-1">
          <div className="flex justify-between text-sm">
            <span>Experience</span>
            <span className="font-medium">{profile.experience} years</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Completed Jobs</span>
            <span className="font-medium">{profile.completedJobs}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Hourly Rate</span>
            <span className="font-medium">₦{profile.hourlyRate}</span>
          </div>
        </div>
      </CardBody>

      <CardFooter className="pt-4">
        <Button className="w-full" onClick={() => onViewDetails(profile)}>
          View Full Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArtisanSummaryCard;
