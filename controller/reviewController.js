const Review = require("../models/review");
const Employer = require("../models/employer");
const Artisan = require("../models/artisan");
const jobSchema = require("../models/jobSchema");

const leaveReview = async (req, res) => {
  try {
    const {
      reviewerId,
      recipientId,
      jobId,
      reviewerType,
      recipientType,
      rating,
      comment,
    } = req.body;

    if (
      !reviewerId ||
      !recipientId ||
      !jobId ||
      !reviewerType ||
      !recipientType ||
      !rating
    ) {
      return res.status(400).json({ msg: "Missing required fields." });
    }

    if (
      !["Employer", "Artisan"].includes(reviewerType) ||
      !["Employer", "Artisan"].includes(recipientType)
    ) {
      return res
        .status(400)
        .json({ msg: "Invalid reviewer or recipient type." });
    }

    // Prevent self-review
    if (reviewerId === recipientId) {
      return res.status(400).json({ msg: "You cannot review yourself." });
    }

    // Check if a review already exists for this job between the same reviewer-recipient
    const existingReview = await Review.findOne({
      reviewerId,
      recipientId,
      jobId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ msg: "You have already reviewed this job." });
    }

    const newReview = new Review({
      reviewerId,
      reviewerType,
      recipientId,
      recipientType,
      jobId,
      rating,
      comment,
    });

    await newReview.save();
    res.status(200).json({ msg: "Review added successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
};

const editReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ msg: "Review not found." });

    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.status(200).json({ msg: "Review updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) return res.status(404).json({ msg: "Review not found." });

    res.status(200).json({ msg: "Review deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
};

const getArtisansToRate = async (req, res) => {
  try {
    const { employerId } = req.params;
    const employer = await Employer.findById(employerId);
    if (!employer) {
      return res.status(404).json({ msg: "Employer not found" });
    }

    // Find all jobs posted by the employer with at least one "Employed" application
    const jobs = await jobSchema
      .find({
        employerEmail: employer.email, // Adjust if you have a direct employer reference
        "applications.status": "Employed",
      })
      .populate("applications.artisanId");

    // Build a map where each artisan ID maps to the list of jobs they worked on
    const artisanJobsMap = {};
    jobs.forEach((job) => {
      job.applications.forEach((app) => {
        if (app.status === "Employed") {
          const artisanId = app.artisanId._id.toString();
          if (!artisanJobsMap[artisanId]) artisanJobsMap[artisanId] = [];
          artisanJobsMap[artisanId].push(job);
        }
      });
    });

    // Get unique artisan IDs
    const artisanIds = Object.keys(artisanJobsMap);
    const artisans = await Artisan.find({ _id: { $in: artisanIds } });

    // For each artisan, build a review status list for each job
    const results = await Promise.all(
      artisans.map(async (artisan) => {
        const jobsForArtisan = artisanJobsMap[artisan._id.toString()] || [];
        const jobsWithReviewStatus = await Promise.all(
          jobsForArtisan.map(async (job) => {
            const review = await Review.findOne({
              reviewerId: employer._id,
              reviewerType: "Employer",
              recipientId: artisan._id,
              recipientType: "Artisan",
              jobId: job._id,
            });
            return {
              jobId: job._id,
              // Optionally include other job details:
              jobType: job.type,
              category: job.category,
              jobTitle: job.jobTitle,
              reviewed: review ? true : false,
              reviewRating: review ? review.rating : null,
            };
          }),
        );
        return {
          artisan,
          jobs: jobsWithReviewStatus,
        };
      }),
    );

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
};

const getEmployersToRate = async (req, res) => {
  try {
    const { artisanId } = req.params;
    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      return res.status(404).json({ msg: "Artisan not found" });
    }

    // 1. Find jobs where this artisan was employed
    const jobs = await jobSchema.find({
      "applications.artisanId": artisan._id,
      "applications.status": "Employed",
    });

    // 2. Extract unique employer emails from the jobs
    const employerEmails = [...new Set(jobs.map((job) => job.employerEmail))];

    // 3. Fetch employer details based on email
    const employers = await Employer.find({
      email: { $in: employerEmails },
    }).select("email CompanyName country state city");

    // 4. Map employer details back to each job
    const jobsWithEmployers = jobs.map((job) => ({
      ...job.toObject(),
      employer:
        employers.find((emp) => emp.email === job.employerEmail) || null,
    }));

    // 5. Build a map where each employer (keyed by their email) maps to the list of jobs
    const employerJobsMap = {};
    jobsWithEmployers.forEach((job) => {
      // Ensure employer exists (it might be null if lookup failed)
      if (job.employer) {
        const employerKey = job.employer.email;
        if (!employerJobsMap[employerKey]) {
          employerJobsMap[employerKey] = [];
        }
        employerJobsMap[employerKey].push(job);
      }
    });

    // 6. For each employer, build a list of jobs with review status
    const results = await Promise.all(
      Object.keys(employerJobsMap).map(async (employerKey) => {
        const jobsForEmployer = employerJobsMap[employerKey];
        // Use the first job’s employer info for simplicity
        const employerInfo = jobsForEmployer[0].employer;
        const jobsWithReviewStatus = await Promise.all(
          jobsForEmployer.map(async (job) => {
            const review = await Review.findOne({
              reviewerId: artisan._id,
              reviewerType: "Artisan",
              recipientId: employerInfo._id,
              recipientType: "Employer",
              jobId: job._id,
            });
            return {
              jobId: job._id,
              jobType: job.type,
              category: job.category,
              jobTitle: job.jobTitle,
              reviewed: review ? true : false,
              reviewRating: review ? review.rating : null,
            };
          }),
        );
        return {
          employer: employerInfo,
          jobs: jobsWithReviewStatus,
        };
      }),
    );

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
};
module.exports = {
  leaveReview,
  editReview,
  deleteReview,
  getArtisansToRate,
  getEmployersToRate,
};

