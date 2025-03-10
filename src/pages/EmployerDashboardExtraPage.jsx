import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Modal,
  Spinner,
} from "@heroui/react";
import { AiOutlineEye, AiOutlineCheck, AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router";
import { useGetAllEmployerApplications } from "../adapters/Requests"; // Adjust the import path as needed

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const {
    data,
    isLoading: jobsLoading,
    isError,
  } = useGetAllEmployerApplications(); // returns list of jobs with applications

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const jobApplications = data?.jobApplications || [];
  const handleShowMore = (jobId) => {
    navigate(`/job/${jobId}/applications`);
  };

  const handleEmploy = (jobId, artisanId) => {
    setSelectedApplication({ jobId, artisanId });
    setModalOpen(true);
  };

  const confirmEmploy = async () => {
    // Call employ mutation here
    setModalOpen(false);
  };
  console.log(jobApplications);

  if (jobsLoading)
    return (
      <div className="w-full flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  if (isError)
    return (
      <div className="text-red-500 text-center text-4xl">
        Error loading data, please try again.
      </div>
    );

  return (
    <div className="container p-4">
      {jobApplications.length === 0 ? (
        <div className="text-center p-6">
          <h2 className="text-xl font-semibold mb-4">
            You haven’t posted any jobs yet.
          </h2>
          <Button
            color="primary"
            onClick={() => navigate("/employer/create-job")}
            startContent={<AiOutlinePlus />}
          >
            Create Job
          </Button>
        </div>
      ) : (
        jobApplications.map((job) => (
          <Card key={job.jobId} className="mb-6">
            <CardHeader>
              <h1 className="text-2xl font-bold">{job.jobTitle}</h1>
            </CardHeader>
            <CardBody>
              <div className="mt-4">
                <h2 className="font-semibold">
                  Applications ({job.applications.length})
                </h2>
                {job.applications.length === 0 ? (
                  <p className="text-gray-500">
                    No applications have been made for this job yet.
                  </p>
                ) : (
                  <ul>
                    {job.applications.slice(0, 2).map((app) => (
                      <li
                        key={app.artisanId}
                        className="flex justify-between items-center p-2 border-b"
                      >
                        <div>
                          <span>Name: {app.artisanName}</span> -
                          <span>Status: {app.status}</span>
                        </div>
                        <Button
                          color="primary"
                          onClick={() => handleEmploy(job.jobId, app.artisanId)}
                          startContent={<AiOutlineCheck />}
                        >
                          Employ
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardBody>
            <CardFooter className="flex justify-end">
              <Button
                color="secondary"
                onClick={() => handleShowMore(job.jobId)}
                startContent={<AiOutlineEye />}
              >
                Show More
              </Button>
            </CardFooter>
          </Card>
        ))
      )}

      {/* Confirmation Modal */}
      {isModalOpen && (
        <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-xl font-bold">Confirm Employment</h2>
            <p>Are you sure you want to employ this artisan for the job?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button color="danger" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button color="primary" onClick={confirmEmploy}>
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
