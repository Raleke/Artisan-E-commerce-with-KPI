const mongoose = require("mongoose");
const Review = require("./models/review");
const Job = require("./models/jobSchema");
const Employer = require("./models/employer");
const Artisan = require("./models/artisan");

const seedDatabase = async () => {
  const dbURI =
    process.env.MONGO_URI || "mongodb://localhost:27017/EmployerAPI";
  await mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // // Clear existing data
  // await Review.deleteMany({});
  // await Job.deleteMany({});
  // await Employer.deleteMany({});
  // await Artisan.deleteMany({});

  // Create sample artisans
  // const artisans = [];
  // for (let i = 1; i <= 10; i++) {
  //   artisans.push(
  //     new Artisan({
  //       firstName: `ArtisanFirstName${i}`,
  //       lastName: `ArtisanLastName${i}`,
  //       email: `artisan${i}@example.com`,
  //       gender: i % 2 === 0 ? "Male" : "Female",
  //       whatsappNumber: `123456789${i}`,
  //       phoneNumber: `098765432${i}`,
  //       password: "password123",
  //       dob: new Date(1990, i, i),
  //       streetAddress: `${i} Main St`,
  //       city: "Anytown",
  //       state: "Anystate",
  //       country: "Anycountry",
  //       jobType: i % 2 === 0 ? "Contract" : "Full-Time",
  //       jobCategories: [
  //         {
  //           jobCategory: `Category${i}`,
  //           skills: [`Skill${i}a`, `Skill${i}b`],
  //         },
  //       ],
  //       yearsOfExperience: i,
  //       artisanDescription: `Experienced in Category${i}`,
  //       education: {
  //         level: "Secondary School",
  //         details: {
  //           course: "General Studies",
  //           gradYear: 2008 + i,
  //           certObtained: "High School Diploma",
  //         },
  //       },
  //       workExperience: {
  //         hasExperience: "Yes",
  //         details: {
  //           companyName: `Company${i}`,
  //           role: `Role${i}`,
  //           startYear: 2010 + i,
  //           endYear: 2015 + i,
  //         },
  //       },
  //     }),
  //   );
  // }
  // await Artisan.insertMany(artisans);
  //
  // // Create sample employers
  // const employers = [];
  // for (let i = 1; i <= 5; i++) {
  //   employers.push(
  //     new Employer({
  //       email: `employer${i}@example.com`,
  //       password: "password123",
  //       CompanyName: `Company${i}`,
  //       companyNum: `123456789${i}`,
  //       country: "Anycountry",
  //       state: "Anystate",
  //       city: "Anytown",
  //     }),
  //   );
  // }
  // await Employer.insertMany(employers);

  // Create sample jobs
  const jobs = [];
  for (let i = 1; i <= 5; i++) {
    jobs.push(
      new Job({
        companyName: `Company${i}`,
        jobTitle: `JobTitle${i}`,
        employerEmail: `employer${i}@example.com`,
        applicationDeadline: new Date(2023, 12, 31),
        workType: i % 2 === 0 ? "Full-time" : "Part-time",
        commuteType: i % 2 === 0 ? "Remote" : "Onsite",
        location: "Anytown",
        pay: {
          amount: 50000 + i * 1000,
          frequency: i % 2 === 0 ? "Per Day" : "Per Month",
        },
        category: i % 2 === 0 ? "Engineering" : "Marketing",
        requiredSkill: `Skill${i}`,
        slots: i,
        accommodation: i % 2 === 0 ? "Yes" : "No",
      }),
    );
  }
  await Job.insertMany(jobs);

  // Create sample reviews
  // const reviews = [];
  // for (let i = 1; i <= 10; i++) {
  //   reviews.push(
  //     new Review({
  //       reviewerId: artisans[i % 10]._id,
  //       reviewerType: "Artisan",
  //       recipientId: employers[i % 5]._id,
  //       recipientType: "Employer",
  //       rating: (i % 5) + 1,
  //       comment: `Review comment ${i}`,
  //     }),
  //   );
  // }
  // await Review.insertMany(reviews);

  console.log("Database seeded!");
  mongoose.connection.close();
};

seedDatabase().catch((err) => {
  console.error(err);
  mongoose.connection.close();
});
