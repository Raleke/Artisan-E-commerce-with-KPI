import React, { useState, useMemo } from "react";
import { Select, SelectItem, Input, Button, Spinner } from "@heroui/react";
import { FaSearch } from "react-icons/fa";
import job from "../assets/job.png";
import JobOpeningCard from "../components/cards/JobOpeningCard";
import { useGetALLJobs } from "../adapters/Requests";

const JobOffersPage = ({ mode }) => {
  const getOpenings = useGetALLJobs(mode);
  const jobDetailsArray = getOpenings.data?.jobs ?? [];
  const [selectedCategory, setSelectedCategory] = useState(new Set([]));
  const [selectedSkill, setSelectedSkill] = useState(new Set([]));
  const [searchLocation, setSearchLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;

  // Memoize categories and skills to prevent recalculation on every render
  const categories = useMemo(
    () => [...new Set(jobDetailsArray.map((job) => job.category))],
    [jobDetailsArray],
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
  }, [selectedCategory, jobDetailsArray]);

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
  }, [selectedCategory, selectedSkill, searchLocation, jobDetailsArray]);

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
  if (getOpenings.isLoading) {
    return <Spinner />;
  }
  return (
    <div className="container mx-auto px-4 py-16">
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
