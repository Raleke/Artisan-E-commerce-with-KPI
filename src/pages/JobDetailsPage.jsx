import { useParams } from "react-router";
import { useGetJobDetails } from "../adapters/Requests";
import JobDetailsCard from "../components/cards/JobDetailsCard";
import { Spinner } from "@heroui/react";
import { FaChevronLeft } from "react-icons/fa";
import GoBack from "../components/GoBack";

const jobDetailsPage = () => {
  const params = useParams();
  const { isLoading, data } = useGetJobDetails(params.id);
  const jobDetails = data?.job || {};

  const userRole = "employer"; // or "employer"
  const isOwner = true; // or false
  const onDelete = () => {
    console.log("Job deleted");
  };
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="Max-w-7xl mx-auto px-4 py-16 min-h-[80vh] flex flex-col justify-center items-center">
      <GoBack />
      <JobDetailsCard
        userRole={userRole}
        isOwner={isOwner}
        onDelete={onDelete}
        details={jobDetails}
      />
    </div>
  );
};

export default jobDetailsPage;
