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
} from "@heroui/react";
import { AiOutlineMenuFold } from "react-icons/ai";
import { useMemo } from "react";
import { FaSearch } from "react-icons/fa";
const applications = [
  {
    title: "Production Manager",
    employer: "Company A",
    priceRange1: 200000,
    priceRange2: 250000,
    location: "Magodo phase 2, Lagos",
    date: "2024-11-12 12:17:22",
    status: "Pending",
  },
  {
    title: "Software Engineer",
    employer: "Company B",
    priceRange1: 300000,
    priceRange2: 400000,
    location: "Victoria Island, Lagos",
    date: "2024-10-10 09:00:00",
    status: "Accepted",
  },
  {
    title: "Data Analyst",
    employer: "Company C",
    priceRange1: 150000,
    priceRange2: 200000,
    location: "Ikeja, Lagos",
    date: "2024-09-15 14:30:00",
    status: "Rejected",
  },
  {
    title: "Graphic Designer",
    employer: "Company D",
    priceRange1: 100000,
    priceRange2: 150000,
    location: "Lekki, Lagos",
    date: "2024-08-20 10:00:00",
    status: "Pending",
  },
  {
    title: "Marketing Manager",
    employer: "Company E",
    priceRange1: 250000,
    priceRange2: 300000,
    location: "Ikeja, Lagos",
    date: "2024-07-18 11:30:00",
    status: "Accepted",
  },
  {
    title: "HR Specialist",
    employer: "Company F",
    priceRange1: 180000,
    priceRange2: 220000,
    location: "Yaba, Lagos",
    date: "2024-06-25 09:45:00",
    status: "Rejected",
  },
  {
    title: "Project Manager",
    employer: "Company G",
    priceRange1: 350000,
    priceRange2: 400000,
    location: "Surulere, Lagos",
    date: "2024-05-30 14:00:00",
    status: "Pending",
  },
  {
    title: "Accountant",
    employer: "Company H",
    priceRange1: 200000,
    priceRange2: 250000,
    location: "Ikeja, Lagos",
    date: "2024-04-15 13:00:00",
    status: "Accepted",
  },
  {
    title: "Customer Service Representative",
    employer: "Company I",
    priceRange1: 120000,
    priceRange2: 150000,
    location: "Victoria Island, Lagos",
    date: "2024-03-10 08:30:00",
    status: "Rejected",
  },
  {
    title: "Business Analyst",
    employer: "Company J",
    priceRange1: 300000,
    priceRange2: 350000,
    location: "Lekki, Lagos",
    date: "2024-02-20 15:00:00",
    status: "Pending",
  },
  {
    title: "Web Developer",
    employer: "Company K",
    priceRange1: 250000,
    priceRange2: 300000,
    location: "Yaba, Lagos",
    date: "2024-01-25 10:15:00",
    status: "Accepted",
  },
  {
    title: "Sales Executive",
    employer: "Company L",
    priceRange1: 150000,
    priceRange2: 200000,
    location: "Surulere, Lagos",
    date: "2023-12-15 12:00:00",
    status: "Rejected",
  },
  {
    title: "IT Support Specialist",
    employer: "Company M",
    priceRange1: 180000,
    priceRange2: 220000,
    location: "Ikeja, Lagos",
    date: "2023-11-10 09:30:00",
    status: "Pending",
  },
  {
    title: "Operations Manager",
    employer: "Company N",
    priceRange1: 300000,
    priceRange2: 350000,
    location: "Victoria Island, Lagos",
    date: "2023-10-05 14:45:00",
    status: "Accepted",
  },
  {
    title: "Content Writer",
    employer: "Company O",
    priceRange1: 100000,
    priceRange2: 150000,
    location: "Lekki, Lagos",
    date: "2023-09-20 11:00:00",
    status: "Rejected",
  },
  {
    title: "Digital Marketer",
    employer: "Company P",
    priceRange1: 200000,
    priceRange2: 250000,
    location: "Yaba, Lagos",
    date: "2023-08-15 13:30:00",
    status: "Pending",
  },
  {
    title: "Financial Analyst",
    employer: "Company Q",
    priceRange1: 250000,
    priceRange2: 300000,
    location: "Surulere, Lagos",
    date: "2023-07-10 10:45:00",
    status: "Accepted",
  },
  {
    title: "Administrative Assistant",
    employer: "Company R",
    priceRange1: 120000,
    priceRange2: 150000,
    location: "Ikeja, Lagos",
    date: "2023-06-05 09:00:00",
    status: "Rejected",
  },
  {
    title: "UX/UI Designer",
    employer: "Company S",
    priceRange1: 200000,
    priceRange2: 250000,
    location: "Victoria Island, Lagos",
    date: "2023-05-01 15:30:00",
    status: "Pending",
  },
  {
    title: "Network Engineer",
    employer: "Company T",
    priceRange1: 300000,
    priceRange2: 350000,
    location: "Lekki, Lagos",
    date: "2023-04-10 12:15:00",
    status: "Accepted",
  },
  {
    title: "Data Scientist",
    employer: "Company U",
    priceRange1: 350000,
    priceRange2: 400000,
    location: "Yaba, Lagos",
    date: "2023-03-15 14:00:00",
    status: "Rejected",
  },
  {
    title: "Product Manager",
    employer: "Company V",
    priceRange1: 400000,
    priceRange2: 450000,
    location: "Surulere, Lagos",
    date: "2023-02-20 11:30:00",
    status: "Pending",
  },
  {
    title: "Legal Advisor",
    employer: "Company W",
    priceRange1: 250000,
    priceRange2: 300000,
    location: "Ikeja, Lagos",
    date: "2023-01-25 10:00:00",
    status: "Accepted",
  },
  {
    title: "HR Manager",
    employer: "Company X",
    priceRange1: 300000,
    priceRange2: 350000,
    location: "Victoria Island, Lagos",
    date: "2022-12-15 09:45:00",
    status: "Rejected",
  },
  {
    title: "Software Tester",
    employer: "Company Y",
    priceRange1: 200000,
    priceRange2: 250000,
    location: "Lekki, Lagos",
    date: "2022-11-10 14:30:00",
    status: "Pending",
  },
  {
    title: "Mechanical Engineer",
    employer: "Company Z",
    priceRange1: 350000,
    priceRange2: 400000,
    location: "Yaba, Lagos",
    date: "2022-10-05 12:00:00",
    status: "Accepted",
  },
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

export default function Notifications() {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;

  const statusColors = {
    Pending: "warning",
    Accepted: "success",
    Rejected: "danger",
  };

  const filteredApps = useMemo(() => {
    let apps = applications.filter((app) => {
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
  }, [filter, searchTerm, sortOption]);

  const totalPages = Math.ceil(filteredApps.length / jobsPerPage);
  const displayedJobs = filteredApps.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage,
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-bold mb-4">Application Notifications</h2>
      </div>

      <div className="mb-8 space-y-4">
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
                      Salary: {formatCurrency(app.priceRange1)} -{" "}
                      {formatCurrency(app.priceRange2)}
                    </p>
                    <p className="">Location: {app.location}</p>
                    <p className="">Applied on: {app.date}</p>
                    <Button
                      startContent=<AiOutlineMenuFold />
                      color="primary"
                      variant="flat"
                      className="mt-4"
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
