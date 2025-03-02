import React, { useState, useMemo } from "react";
import { Select, SelectItem, Input, Button } from "@heroui/react";
import { FaSearch } from "react-icons/fa";
import job from "../assets/job.png";
import JobOpeningCard from "../components/cards/JobOpeningCard";
import { useGetALLJobs } from "../adapters/Requests";
const jobDetailsArray = [
  {
    tittle: "Production Manager",
    employer: "Company A",
    priceRange1: 200000,
    priceRange2: 250000,
    location: "Magodo phase 2, Lagos",
    date: "2024-11-12 12:17:22",
    category: "Engineering",
    skills: ["Production Management", "Project Management"],
  },
  {
    tittle: "Software Engineer",
    employer: "Company B",
    priceRange1: 300000,
    priceRange2: 400000,
    location: "Victoria Island, Lagos",
    date: "2024-10-10 09:00:00",
    category: "Engineering",
    skills: ["Software Development", "Web Development"],
  },
  {
    tittle: "Data Analyst",
    employer: "Company C",
    priceRange1: 150000,
    priceRange2: 200000,
    location: "Ikeja, Lagos",
    date: "2024-09-15 14:30:00",
    category: "Engineering",
    skills: ["Data Analysis", "Business Analysis"],
  },
  {
    tittle: "Marketing Specialist",
    employer: "Company D",
    priceRange1: 180000,
    priceRange2: 220000,
    location: "Lekki, Lagos",
    date: "2024-08-20 10:00:00",
    category: "Marketing",
    skills: ["Digital Marketing", "SEO"],
  },
  {
    tittle: "Graphic Designer",
    employer: "Company E",
    priceRange1: 120000,
    priceRange2: 150000,
    location: "Yaba, Lagos",
    date: "2024-07-25 11:45:00",
    category: "Marketing",
    skills: ["Graphic Design", "UI/UX Design"],
  },
  {
    tittle: "HR Manager",
    employer: "Company F",
    priceRange1: 250000,
    priceRange2: 300000,
    location: "Ikeja, Lagos",
    date: "2024-06-30 13:00:00",
    category: "Management",
    skills: ["Human Resources", "Operations Management"],
  },
  {
    tittle: "Sales Executive",
    employer: "Company G",
    priceRange1: 100000,
    priceRange2: 130000,
    location: "Surulere, Lagos",
    date: "2024-05-15 09:30:00",
    category: "Marketing",
    skills: ["Sales", "Customer Support"],
  },
  {
    tittle: "Customer Service Representative",
    employer: "Company H",
    priceRange1: 90000,
    priceRange2: 110000,
    location: "Ajah, Lagos",
    date: "2024-04-10 14:00:00",
    category: "Customer Service",
    skills: ["Customer Support"],
  },
  {
    tittle: "Project Manager",
    employer: "Company I",
    priceRange1: 350000,
    priceRange2: 400000,
    location: "Ikoyi, Lagos",
    date: "2024-03-05 15:30:00",
    category: "Management",
    skills: ["Project Management", "Operations Management"],
  },
  {
    tittle: "Business Analyst",
    employer: "Company J",
    priceRange1: 220000,
    priceRange2: 270000,
    location: "Victoria Island, Lagos",
    date: "2024-02-20 16:00:00",
    category: "Engineering",
    skills: ["Business Analysis", "Data Analysis"],
  },
  {
    tittle: "Content Writer",
    employer: "Company K",
    priceRange1: 80000,
    priceRange2: 100000,
    location: "Ikeja, Lagos",
    date: "2024-01-15 10:30:00",
    category: "Marketing",
    skills: ["Content Writing", "SEO"],
  },
  {
    tittle: "Digital Marketer",
    employer: "Company L",
    priceRange1: 150000,
    priceRange2: 180000,
    location: "Lekki, Lagos",
    date: "2023-12-10 11:00:00",
    category: "Marketing",
    skills: ["Digital Marketing", "Content Writing"],
  },
  {
    tittle: "Network Engineer",
    employer: "Company M",
    priceRange1: 250000,
    priceRange2: 300000,
    location: "Yaba, Lagos",
    date: "2023-11-05 12:00:00",
    category: "Engineering",
    skills: ["Network Engineering", "System Administration"],
  },
  {
    tittle: "UI/UX Designer",
    employer: "Company N",
    priceRange1: 200000,
    priceRange2: 250000,
    location: "Surulere, Lagos",
    date: "2023-10-01 13:30:00",
    category: "Marketing",
    skills: ["UI/UX Design", "Graphic Design"],
  },
  {
    tittle: "Accountant",
    employer: "Company O",
    priceRange1: 180000,
    priceRange2: 220000,
    location: "Ikeja, Lagos",
    date: "2023-09-15 14:45:00",
    category: "Finance",
    skills: ["Accounting", "Financial Analysis"],
  },
  {
    tittle: "Operations Manager",
    employer: "Company P",
    priceRange1: 300000,
    priceRange2: 350000,
    location: "Victoria Island, Lagos",
    date: "2023-08-20 15:00:00",
    category: "Management",
    skills: ["Operations Management", "Project Management"],
  },
  {
    tittle: "Web Developer",
    employer: "Company Q",
    priceRange1: 150000,
    priceRange2: 200000,
    location: "Lekki, Lagos",
    date: "2023-07-25 16:00:00",
    category: "Engineering",
    skills: ["Web Development", "Software Development"],
  },
  {
    tittle: "Data Scientist",
    employer: "Company R",
    priceRange1: 350000,
    priceRange2: 400000,
    location: "Ikoyi, Lagos",
    date: "2023-06-30 17:00:00",
    category: "Engineering",
    skills: ["Data Science", "Data Analysis"],
  },
  {
    tittle: "Financial Analyst",
    employer: "Company S",
    priceRange1: 220000,
    priceRange2: 270000,
    location: "Yaba, Lagos",
    date: "2023-05-15 18:00:00",
    category: "Finance",
    skills: ["Financial Analysis", "Accounting"],
  },
  {
    tittle: "Product Manager",
    employer: "Company T",
    priceRange1: 300000,
    priceRange2: 350000,
    location: "Surulere, Lagos",
    date: "2023-04-10 19:00:00",
    category: "Management",
    skills: ["Product Management", "Project Management"],
  },
  {
    tittle: "Mobile App Developer",
    employer: "Company U",
    priceRange1: 250000,
    priceRange2: 300000,
    location: "Ikeja, Lagos",
    date: "2023-03-05 20:00:00",
    category: "Engineering",
    skills: ["Mobile App Development", "Software Development"],
  },
  {
    tittle: "SEO Specialist",
    employer: "Company V",
    priceRange1: 120000,
    priceRange2: 150000,
    location: "Victoria Island, Lagos",
    date: "2023-02-20 21:00:00",
    category: "Marketing",
    skills: ["SEO", "Content Writing"],
  },
  {
    tittle: "Technical Support Engineer",
    employer: "Company W",
    priceRange1: 100000,
    priceRange2: 130000,
    location: "Lekki, Lagos",
    date: "2023-01-15 22:00:00",
    category: "Engineering",
    skills: ["Technical Support", "System Administration"],
  },
  {
    tittle: "System Administrator",
    employer: "Company X",
    priceRange1: 200000,
    priceRange2: 250000,
    location: "Yaba, Lagos",
    date: "2022-12-10 23:00:00",
    category: "Engineering",
    skills: ["System Administration", "Network Engineering"],
  },
  {
    tittle: "DevOps Engineer",
    employer: "Company Y",
    priceRange1: 300000,
    priceRange2: 350000,
    location: "Surulere, Lagos",
    date: "2022-11-05 08:00:00",
    category: "Engineering",
    skills: ["DevOps", "System Administration"],
  },
];

const JobOffersPage = () => {
  const getOpenings = useGetALLJobs();
  const jobDetailsArray = getOpenings.data?.jobs ?? [];
  const [selectedCategory, setSelectedCategory] = useState(new Set([]));
  const [selectedSkill, setSelectedSkill] = useState(new Set([]));
  const [searchLocation, setSearchLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;

  // Memoize categories and skills to prevent recalculation on every render
  const categories = useMemo(
    () => [...new Set(jobDetailsArray.map((job) => job.category))],
    [],
  );

  // Memoize skills based on selected category
  const availableSkills = useMemo(() => {
    const categoryValue = Array.from(selectedCategory)[0];
    if (!categoryValue) return [];
    return [
      ...new Set(
        jobDetailsArray
          .filter((job) => job.category === categoryValue)
          .flatMap((job) => job.skills),
      ),
    ];
  }, [selectedCategory]);

  // Memoize filtered jobs based on all filters
  const filteredJobs = useMemo(() => {
    const categoryValue = Array.from(selectedCategory)[0];
    const skillValue = Array.from(selectedSkill)[0];

    return jobDetailsArray.filter((job) => {
      const categoryMatch = !categoryValue || job.category === categoryValue;
      const skillMatch = !skillValue || job.skills.includes(skillValue);
      const locationMatch =
        !searchLocation ||
        job.location.toLowerCase().includes(searchLocation.toLowerCase());

      return categoryMatch && skillMatch && locationMatch;
    });
  }, [selectedCategory, selectedSkill, searchLocation]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const displayedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage,
  );

  const handleCategoryChange = (value) => {
    setSelectedCategory(new Set(value));
    setSelectedSkill(new Set([]));
    setCurrentPage(1);
  };

  const handleSkillChange = (value) => {
    setSelectedSkill(new Set(value));
    setCurrentPage(1);
  };

  const handleLocationSearch = (e) => {
    setSearchLocation(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-20">
        <h1 className="text-4xl font-bold mb-4">Find New and Relevant Jobs</h1>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-8 content-center">
          <div className="md:w-1/3 flex flex-col md:flex-row gap-4">
            <Select
              label="Select Category"
              placeholder="Select a category"
              variant="bordered"
              selectedKeys={selectedCategory}
              onSelectionChange={handleCategoryChange}
            >
              {categories.map((category) => (
                <SelectItem key={category}>{category}</SelectItem>
              ))}
            </Select>

            <Select
              label="Select Skill"
              placeholder="Select a skill"
              variant="bordered"
              selectedKeys={selectedSkill}
              onSelectionChange={handleSkillChange}
              isDisabled={selectedCategory.size === 0}
            >
              {availableSkills.map((skill) => (
                <SelectItem key={skill}>{skill}</SelectItem>
              ))}
            </Select>
          </div>

          <Input
            placeholder="Search Location..."
            endContent={<FaSearch size={20} />}
            variant="bordered"
            size="lg"
            className="w-full md:w-1/3"
            value={searchLocation}
            onChange={handleLocationSearch}
          />
        </div>
      </div>

      {displayedJobs.length > 0 ? (
        <>
          <div className="flex flex-wrap -mt-0 -mx-2">
            {displayedJobs.map((details, index) => (
              <div
                className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2 mt-2 mb-4"
                key={index}
              >
                <JobOpeningCard details={details} />
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
        <div className="text-center mt-20">
          <img src={job} alt="job icon" className="w-96 h-96 mx-auto" />
          <h2 className="text-2xl font-bold mb-4">No jobs found</h2>
          <p>
            Try adjusting your filters or check back later for new job postings.
          </p>
        </div>
      )}
    </div>
  );
};

export default JobOffersPage;
