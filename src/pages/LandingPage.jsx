import JobOpeningCard from "../components/cards/JobOpeningCard";
import LandingHeroCard from "../components/cards/LandingHeroCard";
import TestimonialsCarousel from "../components/cards/TestimonialsCarousel";

import connection from "../assets/connection.png";
import create from "../assets/create.png";
import meeting from "../assets/meeting.png";
import search from "../assets/search.png";
import paper_plane from "../assets/paper-plane.png";
import new_window from "../assets/new-window.png";
import StepsCarousel from "../components/cards/StepsCarousel";
import { useGetALLJobs } from "../adapters/Requests";
import { Spinner } from "@heroui/react";

export default function LandingPage() {
  const getOpenings = useGetALLJobs();
  const jobDetailsArray = getOpenings.data?.jobs.slice(0, 3) || [];
  console;
  const steps = [
    {
      id: 1,
      title: "Create Your Profile",
      description:
        "Register for free and create a professional profile that employers and customers love. Your account will be reviewed and approved by the admin.",
      icon: create, // You can replace this with an actual icon component if needed
    },
    {
      id: 2,
      title: "Search and Apply for Jobs",
      description:
        "Login to your account and start applying for jobs. We will screen you online to make sure you're the right fit before connecting you to the employer for your interview.",
      icon: connection, // You can replace this with an actual icon component if needed
    },
    {
      id: 3,
      title: "Meet the Employer",
      description:
        "Attend interview with your prospective employer and check the Assessment section in your account to receive feedback from the employer. You can also chat directly with the employer on the platform.",
      icon: meeting, // You can replace this with an actual icon component if needed
    },
  ];
  const steps2 = [
    {
      id: 1,
      title: "Create your free employer dashboard",
      description:
        "All you need is your email address to create your dashboard and start posting your jobs.",
      icon: new_window, // You can replace this with an actual icon component if needed
    },
    {
      id: 2,
      title: "Post Your Job",
      description:
        "Post jobs from your dashboard. Our team will review your job post, approve it and you're ready to go.",
      icon: paper_plane, // You can replace this with an actual icon component if needed
    },
    {
      id: 3,
      title: "Receive screened candidates",
      description:
        "Our experienced recruiters will screen applicants and shortlist top 3 candidates for your interview. Schedule interviews with them and select the best candidate. Remember to submit your feedback in the Assessment section of the candidates' profiles to better their chances in their next job hunts.",
      icon: search, // You can replace this with an actual icon component if needed
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
            {getOpenings.isLoading && <Spinner />}

            {!getOpenings.isLoading &&
              jobDetailsArray.map((details, index) => (
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
          <h1 className="text-5xl mb-8 text-primary-600">Testimonials</h1>
          <div className="flex flex-wrap -mt-0 -mx-2">
            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </div>
      </div>
      <div className="text-center mt-12 py-24">
        <div className="lg:max-w-7xl md:max-w-5xl max-w-3xl w-full px-4 mx-auto">
          <h1 className="text-4xl mb-8 ">How it works for Job Seekers</h1>
          <StepsCarousel steps={steps} />
        </div>
      </div>

      <div className="text-center mt-12 py-24">
        <div className="lg:max-w-7xl md:max-w-5xl max-w-3xl w-full px-4 mx-auto">
          <h1 className="text-4xl mb-8 ">How it works for Employeers</h1>
          <StepsCarousel steps={steps2} />
        </div>
      </div>
    </>
  );
}
