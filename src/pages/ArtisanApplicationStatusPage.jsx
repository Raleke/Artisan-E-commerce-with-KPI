import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Select,
  SelectItem,
  Input,
  Spinner,
  Link
} from "@heroui/react";
import { AiOutlineMenuFold } from "react-icons/ai";
import { useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import { useGetArtisanApplications } from "../adapters/Requests";
import { formatDate } from "../utils/utiils";
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

export default function Notifications() {
  const { isLoading, data } = useGetArtisanApplications();
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;
  console.log(data);
  const applications = data?.jobs;

  const statusColors = {
    Pending: "warning",
    Employed: "success",
    Rejected: "danger",
  };

  const filteredApps = useMemo(() => {
    if (!applications) return [];
    let apps = applications?.filter((app) => {
      const statusMatch = filter === "All" || app.status === filter;
      const searchMatch =
        app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.employer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.location.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && searchMatch;
    });

    if (sortOption === "date") {
      apps = apps.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === "status") {
      apps = apps.sort((a, b) => a.status.localeCompare(b.status));
    }

    return apps;
  }, [filter, searchTerm, sortOption, applications]);

  const totalPages = Math.ceil(filteredApps.length / jobsPerPage);
  const displayedJobs = filteredApps.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage,
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-7xl container mx-auto px-4 py-16">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-bold mb-4">Application Notifications</h2>
      </div>

      <div className="mb-8 space-y-4 min-w-full">
        <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-8 content-center">
          <div className="md:w-1/3 flex flex-col md:flex-row gap-4">
            <Select
              label="Status"
              variant="bordered"
              selectedKeys={[filter]}
              onSelectionChange={(keys) => setFilter(Array.from(keys)[0])}
              className="mb-6 w-full md:w-1/3"
            >
              {["All", "Pending", "Accepted", "Rejected"].map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Sort by"
              variant="bordered"
              selectedKeys={[sortOption]}
              onSelectionChange={(keys) => setSortOption(Array.from(keys)[0])}
              className="mb-6 w-full md:w-1/3"
            >
              <SelectItem key="date" value="date">
                Date
              </SelectItem>
              <SelectItem key="status" value="status">
                Status
              </SelectItem>
            </Select>
          </div>

          <Input
            placeholder="Search..."
            endContent={<FaSearch size={20} />}
            variant="bordered"
            size="lg"
            className="w-full md:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {displayedJobs.length > 0 ? (
        <>
          <div className="flex flex-wrap -mt-0 -mx-2">
            {displayedJobs.map((app, index) => (
              <div className="w-full md:w-1/2 lg:w-1/3 p-2" key={index}>
                <Card key={index} className="w-full">
                  <CardHeader className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{app.title}</h3>
                      <p className="">Company: {app.employer}</p>
                    </div>
                    <Chip color={statusColors[app.status]}>{app.status}</Chip>
                  </CardHeader>
                  <CardBody>
                    <p className="">
                      Salary: {formatCurrency(app.pay)} ({app.frequency})
                    </p>
                    <p className="">Location: {app.location}</p>
                    <p className="">Applied on: {formatDate(app.date)}</p>
                    <Button
                      startContent=<AiOutlineMenuFold />
                      color="primary"
                      variant="flat"
                      className="mt-4"
                      as={Link}
                      href={`/job/${app.jobId}`}
                    >
                      View Details
                    </Button>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-8">
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index}
                auto
                flat
                color={currentPage === index + 1 ? "primary" : "default"}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-600 text-center mt-4">No applications found.</p>
      )}
    </div>
  );
}
