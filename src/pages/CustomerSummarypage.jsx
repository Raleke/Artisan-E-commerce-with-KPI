import React, { useState, useMemo } from "react";
import { Select, SelectItem, Input, Button, Spinner } from "@heroui/react";
import { FaSearch } from "react-icons/fa";
import artisan from "../assets/job.png";
import ArtisanSummaryCard from "../components/cards/ArtisanSummaryCard";
import { useGetAllArtisans } from "../adapters/Requests";

const ArtisanDetailsPage = () => {
  const getArtisans = useGetAllArtisans();
  const artisanDetailsArray = getArtisans.data?.artisans ?? [];
  const [selectedSkill, setSelectedSkill] = useState(new Set([]));
  const [searchLocation, setSearchLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const artisansPerPage = 12;

  // Memoize skills to prevent recalculation on every render
  const skills = useMemo(
    () => [
      ...new Set(
        artisanDetailsArray.flatMap((artisan) =>
          artisan.jobCategories.flatMap((category) => category.skills),
        ),
      ),
    ],
    [artisanDetailsArray],
  );

  // Memoize filtered artisans based on all filters
  const filteredArtisans = useMemo(() => {
    const skillValue = Array.from(selectedSkill)[0];

    return artisanDetailsArray.filter((artisan) => {
      const skillMatch =
        !skillValue ||
        artisan.jobCategories.some((category) =>
          category.skills.includes(skillValue),
        );
      const locationMatch =
        !searchLocation ||
        artisan.city.toLowerCase().includes(searchLocation.toLowerCase()) ||
        artisan.state.toLowerCase().includes(searchLocation.toLowerCase());

      return skillMatch && locationMatch;
    });
  }, [selectedSkill, searchLocation, artisanDetailsArray]);

  const totalPages = Math.ceil(filteredArtisans.length / artisansPerPage);
  const displayedArtisans = filteredArtisans.slice(
    (currentPage - 1) * artisansPerPage,
    currentPage * artisansPerPage,
  );

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

  if (getArtisans.isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-20">
        <h1 className="text-4xl font-bold mb-4">Find Skilled Artisans</h1>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-8 content-center">
          <div className="md:w-1/3 flex flex-col md:flex-row gap-4">
            <Select
              label="Select Skill"
              placeholder="Select a skill"
              variant="bordered"
              selectedKeys={selectedSkill}
              onSelectionChange={handleSkillChange}
            >
              {skills.map((skill) => (
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

      {displayedArtisans.length > 0 ? (
        <>
          <div className="flex flex-wrap -mt-0 -mx-2">
            {displayedArtisans.map((details, index) => (
              <div
                className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2 mt-2 mb-4"
                key={index}
              >
                <ArtisanSummaryCard profile={transformArtisanData(details)} />
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
          <img src={artisan} alt="artisan icon" className="w-96 h-96 mx-auto" />
          <h2 className="text-2xl font-bold mb-4">No artisans found</h2>
          <p>
            Try adjusting your filters or check back later for new artisan
            profiles.
          </p>
        </div>
      )}
    </div>
  );
};

// Function to transform artisan data to match ArtisanSummaryCard expectations
const transformArtisanData = (artisan) => ({
  id: artisan._id,
  fullName: `${artisan.firstName} ${artisan.lastName}`,
  profession: artisan.jobCategories
    .map((category) => category.jobCategory)
    .join(", "),
  rating: artisan.reviewAvg || 0, // Assuming rating is part of the artisan schema
  skills: artisan.jobCategories.flatMap((category) => category.skills),
  city: artisan.city,
  state: artisan.state,
  availability: artisan.jobType,
  phone: artisan.phoneNumber,
  experience: artisan.yearsOfExperience,
  completedJobs: artisan.no_of_jobs_completed || 0, // Assuming completedJobs is part of the artisan schema
  hourlyRate: artisan.hourlyRate || 0, // Assuming hourlyRate is part of the artisan schema
});

export default ArtisanDetailsPage;
