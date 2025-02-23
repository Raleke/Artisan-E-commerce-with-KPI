import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";

import { FaSearch } from "react-icons/fa";
import ArtisanSummaryCard from "../components/cards/ArtisanSummaryCard";

const EmployerJobApplicantsPage = ({ jobDetails }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  // const { toast } = useToast();

  const applicants = [
    {
      id: "1",
      fullName: "John Doe",
      profession: "Carpenter",
      experience: "15",
      email: "john@example.com",
      phone: "+234 800 123 4567",
      country: "Nigeria",
      state: "Lagos",
      city: "Ikeja",
      hourlyRate: "5000",
      availability: "Weekdays",
      skills: ["Furniture Making", "Wood Carving", "Cabinet Installation"],
      completedJobs: 127,
      rating: 4.8,
      applicationStatus: "Pending",
      applicationDate: "2024-02-20",
    },
  ];

  const updateApplicationStatus = async (applicantId, newStatus) => {
    try {
      const response = await fetch(`/api/applications/${applicantId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      // toast({ title: 'Status Updated', description: 'Application status has been updated successfully.' });
    } catch (error) {
      // toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || applicant.applicationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (profile) => {
    console.log("Viewing details for:", profile);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">
            Applicants for {jobDetails?.title}
          </h2>
          <p className="text-gray-500">
            Total Applications: {applicants.length} | Available Slots:{" "}
            {jobDetails?.slots}
          </p>
        </CardHeader>

        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <FaSearch className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Employed">Employed</SelectItem>
              </Select>
            </div>
          </div>

          {filteredApplicants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No applicants found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplicants.map((applicant) => (
                <div key={applicant.id} className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <Select
                      defaultValue={applicant.applicationStatus}
                      onChange={(e) =>
                        updateApplicationStatus(applicant.id, e.target.value)
                      }
                    >
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Employed">Employed</SelectItem>
                    </Select>
                  </div>
                  <ArtisanSummaryCard
                    profile={applicant}
                    onViewDetails={handleViewDetails}
                  />
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default EmployerJobApplicantsPage;
