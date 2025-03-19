import React, { useEffect } from "react";
import { Card, CardHeader, CardBody, Link } from "@heroui/react";
import { Button } from "@heroui/react";
import roloimage from "../assets/rolo.jpg";
import bensonimage from "../assets/benson.jpeg";
import AOS from "aos";
import "aos/dist/aos.css";
import AnimatedSection from "../components/cards/AnimatedSection";

const AboutUsPage = () => {
  const teamMembers = [
    {
      name: "Raleke Miracle",
      role: "Chief Executive Officer",
      image: roloimage,
      linkedin: "https://www.linkedin.com/in/miracle-raleke-9b2b98343/",
    },
    {
      name: "Benson Emmanuel Abiamanbana",
      role: "Chief Developer",
      image: bensonimage,
      linkedin: "#",
    },
  ];
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center md:mb-20">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
      </div>

      {/* About Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <AnimatedSection direction="left">
          <div className="relative h-96 hidden md:block">
            <img
              src="https://artisanoga.com/artisans/6.png"
              alt="Blue collar worker"
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
        </AnimatedSection>
        <AnimatedSection direction="right">
          <Card>
            <CardBody>
              <h2 className="text-2xl font-bold text-center mb-8">ABOUT US</h2>
              <p className="text-gray-600">
                Founded in 2016, ArtisanOps started as an online directory for
                local artisans but has grown to become the only online
                recruitment services platform in Nigeria that offers training
                and placement of blue-collar workers into decent and fulfilling
                jobs.
              </p>
              <p className="text-gray-600 mt-4">
                We are focused on delivering the best in class services to all
                our clients and job-seekers. Our core business is attracting,
                selecting and managing blue-collar talents for a vast range of
                industries including fashion, banking, oil and gas, education,
                construction, agriculture, food & beverages, transportation,
                etc.
              </p>
            </CardBody>
          </Card>
        </AnimatedSection>{" "}
      </div>

      {/* Vision Section */}
      <Card className="mb-10 text-center">
        <CardBody>
          <h2 className="text-2xl font-bold text-center mb-8">OUR VISION</h2>
          <p className="text-gray-600 text-center">
            To empower millions of blue-collar workers across Africa to access
            meaningful employment globally, and foster economic growth and
            prosperity in the region.
          </p>
        </CardBody>
      </Card>

      {/* Mission Section */}
      <Card className="mb-10 text-center">
        <CardBody>
          <h2 className="text-2xl font-bold text-center mb-8">MISSION</h2>
          <p className="text-gray-600 text-center">
            To revolutionize the recruitment process for blue-collar workers and
            businesses across Africa by providing a seamless online platform
            that connects talents with opportunities. We are committed to
            fostering a more efficient, transparent, and inclusive job market,
            empowering individuals to unlock their full potential and helping
            businesses thrive by accessing the right talent quickly and
            effectively.
          </p>
        </CardBody>
      </Card>

      {/* Core Values Section */}
      <Card className="mb-10 text-center">
        <CardBody>
          <h2 className="text-2xl font-bold text-center">CORE VALUES</h2>
          <p className="text-gray-600 text-center">
            When it comes to our Core Values, we are TIED: Trusted, Innovative,
            Excellent, and Dedicated.
          </p>
        </CardBody>
      </Card>

      {/* Team Section */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="bg-primary">
              <CardBody className="p-6">
                <div className="aspect-square mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-bold text-primary-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-foreground mb-4">{member.role}</p>
                <Button
                  color="default"
                  variant="flat"
                  className="w-full text-primary-foreground"
                  as={Link}
                  href={member.linkedin}
                >
                  LinkedIn
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
