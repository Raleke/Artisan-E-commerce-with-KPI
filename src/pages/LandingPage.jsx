import JobOpeningCard from "../components/cards/JobOpeningCard";
import LandingHeroCard from "../components/cards/LandingHeroCard";
import TestimonialsCarousel from "../components/cards/TestimonialsCarousel";

export default function LandingPage() {
  const jobDetailsArray = [
    {
      tittle: "Production Manager",
      employer: "Company A",
      priceRange1: 200000,
      priceRange2: 250000,
      location: "Magodo phase 2, Lagos",
      date: "2024-11-12 12:17:22",
    },
    {
      tittle: "Software Engineer",
      employer: "Company B",
      priceRange1: 300000,
      priceRange2: 400000,
      location: "Victoria Island, Lagos",
      date: "2024-10-10 09:00:00",
    },
    {
      tittle: "Data Analyst",
      employer: "Company C",
      priceRange1: 150000,
      priceRange2: 200000,
      location: "Ikeja, Lagos",
      date: "2024-09-15 14:30:00",
    },
  ];
  const testimonials = [
    {
      text: "Before I came across ArtisanOga, everybody else I've tried never worked, but with an open mind, I gave them a try, and I must say that the service has been great. My candid score for ArtisanOga is 8.5 out of 10 because I can never rate anyone more than that.",
      author: "DEDE The Brand, Lagos",
    },
    {
      text: "ArtisanOga more than met my expectations. The candidate I hired is very professional and resumes work on time. Thank you for the top-notch services.",
      author: "Tag Fashion Studio, Lagos",
    },
    {
      text: "I'm pleased to have encountered your platform. Finding qualified tailors for my business through your platform was a breeze. Thank you.",
      author: "Enara Patricks",
    },
    {
      text: "My experience with ArtisanOga has been wonderful. Their customer service is exceptional!",
      author: "Laura Threads",
    },
    {
      text: "Victoria has been the best even more than what I bargained. I’m very lucky having someone like her as a staff thank you so much for this gift.",
      author: "Nxtxutz & Styles",
    },
    {
      text: "The candidate I got does her work perfectly well. I've been so scared of getting tailors because I felt they may not be able to give me what I want, but you guys did it, I'm really happy.",
      author: "VEECUR",
    },
  ];

  return (
    <>
      <LandingHeroCard />
      <div className="text-center mt-12 py-24">
        <div className="lg:max-w-7xl md:max-w-5xl max-w-3xl w-full px-4 mx-auto">
          <h1 className="text-4xl mb-8">Featured Jobs</h1>
          <div className="flex flex-wrap -mt-0 -mx-2">
            {jobDetailsArray.map((details, index) => (
              <div
                className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2 mt-2"
                key={index}
              >
                <JobOpeningCard key={index} details={details} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="text-center mt-12 py-24">
        <div className="lg:max-w-7xl md:max-w-5xl max-w-3xl w-full px-4 mx-auto">
          <h1 className="text-4xl mb-8 text-primary-600">Testimonials</h1>
          <div className="flex flex-wrap -mt-0 -mx-2">
            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </div>
      </div>
    </>
  );
}
