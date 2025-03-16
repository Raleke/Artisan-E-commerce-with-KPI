import React from "react";
import { useNavigate, useParams } from "react-router";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Spinner,
  Link,
} from "@heroui/react";
import { AiOutlineDelete, AiOutlineMenuFold } from "react-icons/ai";
import {
  useDeleteJob,
  useGetJobDetailsApplications,
} from "../adapters/Requests"; // Adjust the import path as needed

export default function EmployerJobApplicantsPage() {
  const { jobId } = useParams();
  console.log(jobId);
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetJobDetailsApplications(jobId);
  const deleteJob = useDeleteJob();

  const handleDelete = async () => {
    await deleteJob.mutateAsync(jobId);
    navigate("/employer/dashboard");
  };
  console.log(data);

  if (isLoading)
    return (
      <div className="w-full flex justify-center">
        <Spinner size="lg" />
      </div>
    );

  if (isError)
    return (
      <div className="text-red-500 text-center text-4xl">
        Error loading job details, please try again.
      </div>
    );

  const job = data?.jobApplications;
  console.log(job);

  return (
    <div className="container p-4">
      <Card className="mb-6">
        <CardHeader>
          <h1 className="text-2xl font-bold">{job.jobTitle}</h1>
        </CardHeader>
        <CardBody>
          <p>{job.jobDescription}</p>
        </CardBody>
        <CardFooter className="flex justify-end">
          <Button
            color="danger"
            onClick={handleDelete}
            startContent={<AiOutlineDelete />}
          >
            Delete Job
          </Button>
        </CardFooter>
      </Card>

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
            {job.applications.map((app) => (
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
                  as={Link}
                  href={`/employer/job/${job.jobId}/${app.artisanId}`}
                  startContent={<AiOutlineMenuFold />}
                >
                  View details
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
