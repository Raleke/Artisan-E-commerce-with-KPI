import JobDetailsCard from "../components/cards/JobDetailsCard";

const jobDetailsPage = () => {
  const jobDetails = {
    title: "Software Engineer",
    employer: "Tech Company",
    pay: {
      amount: 500000,
      frequency: "Monthly",
    },
    workType: "Full-time",
    commuteType: "Remote",
    location: "Lagos, Nigeria",
    datePosted: "2023-10-01T00:00:00Z",
    requiredSkill: "JavaScript, React",
    qualification: "Bachelor's Degree in Computer Science",
    slots: 3,
    applicationDeadline: "2023-12-01T00:00:00Z",
  };

  const userRole = "employer"; // or "employer"
  const isOwner = true; // or false
  const onDelete = () => {
    console.log("Job deleted");
  };

  return (
    <div className="Max-w-7xl mx-auto px-4 py-16 min-h-[80vh] flex justify-center items-center">
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
