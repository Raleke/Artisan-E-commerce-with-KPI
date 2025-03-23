const Job = require("../models/jobSchema");
const Employer = require("../models/employer");
const nodemailer = require("nodemailer");
const Artisan = require("../models/artisan");

const addJob = async (req, res) => {
  const {
    employerId,
    applicationDeadline,
    jobTitle,
    workType,
    commuteType,
    location,
    qualification,
    pay,
    requiredSkill,
    category,
    slots,
    accommodation,
  } = req.body;

  const errors = [];
  if (
    !employerId ||
    !applicationDeadline ||
    !jobTitle ||
    !workType ||
    !commuteType ||
    !location ||
    !pay.amount ||
    !pay.frequency ||
    !requiredSkill ||
    !category ||
    !slots ||
    !accommodation
  ) {
    errors.push({ msg: "Please fill in all required fields." });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const employer = await Employer.findById(employerId);
    if (!employer) {
      return res.status(400).json({ msg: "Employer not found." });
    }

    const newJob = new Job({
      companyName: employer.CompanyName,
      employerEmail: employer.email,
      applicationDeadline: new Date(applicationDeadline),
      jobTitle,
      workType,
      commuteType,
      location,
      qualification: qualification || "SSCE",
      pay: {
        amount: pay.amount,
        frequency: pay.frequency,
      },
      requiredSkill,
      category,
      slots,
      accommodation,
    });

    await newJob.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ralekeegan@gmail.com",
        pass: "akfg isge aqkc pgfg",
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: employer.email,
      subject: "Job Posted Successfully",
      text: `Hello ${employer.CompanyName},\n\nYour job posting "${jobTitle}" has been successfully added with ${slots} slots.\n\nRegards,\nYour Artisan Page Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Confirmation email sent:", info.response);
      }
    });

    res.status(201).json({ msg: "Job added successfully.", job: newJob });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ msg: "Server error." });
  }
};

const applyForJob = async (req, res) => {
  const { jobId, applicantEmail } = req.body;
  console.log(req.body);

  if (!jobId || !applicantEmail) {
    return res
      .status(400)
      .json({ msg: "Please provide all required details." });
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found." });
    }

    if (job.applications >= job.slots) {
      return res.status(400).json({ msg: "No slots available for this job." });
    }
    const artisan = await Artisan.findOne({ email: applicantEmail });
    if (!artisan) {
      return res.status(404).json({ msg: "Artisan not found." });
    }
    if (
      job.applications.some(
        (app) => app.artisanId.toString() === artisan._id.toString(),
      )
    ) {
      return res
        .status(400)
        .json({ msg: "You have already applied for this job." });
    }

    job.applications.push({
      artisanId: artisan._id,
      status: "Pending",
    });

    await job.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ralekeegan@gmail.com",
        pass: "akfg isge aqkc pgfg",
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: job.employerEmail,
      subject: `New Applicant for Job: ${job.jobTitle}`,
      text: `Hello ${job.companyName},\n\nYou have a new applicant:\n\nName: ${artisan.firstName} ${artisan.lastName} \nEmail: ${artisan.email}\n\nRegards,\nYour Artisan Page Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Application email sent:", info.response);
      }
    });

    res.status(200).json({ msg: "Application submitted successfully." });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ msg: "Server error." });
  }
};

const getAllJobsPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const jobs = await Job.find().skip(skip).limit(limit);

    res.status(200).json({ jobs, page });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updatedData = req.body;

    const job = await Job.findByIdAndUpdate(jobId, updatedData, { new: true });

    if (!job) {
      return res.status(404).json({ msg: "Job not found." });
    }

    res.status(200).json({ msg: "Job updated successfully", job });
  } catch (err) {
    res.status(500).json({ msg: "Server error." });
  }
};

const getRecommendedJobs = async (req, res) => {
  try {
    const { artisanId } = req.params;
    const artisan = await Artisan.findById(artisanId);

    if (!artisan) return res.status(404).json({ msg: "Artisan not found." });

    const jobs = await Job.find({
      requiredSkill: { $in: artisan.jobCategories.map((jc) => jc.skills) },
    });

    res.status(200).json({ jobs });
  } catch (err) {
    res.status(500).json({ msg: "Server error." });
  }
};

const cancelJobApplication = async (req, res) => {
  try {
    const { jobId, artisanId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: "Job not found." });

    job.applications = job.applications.filter(
      (app) => app.artisanId.toString() !== artisanId,
    );
    await job.save();

    res.status(200).json({ msg: "Application cancelled successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error." });
  }
};

const updateJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: "Job not found." });

    job.status = status;
    await job.save();

    res.status(200).json({ msg: "Job status updated", job });
  } catch (err) {
    res.status(500).json({ msg: "Server error." });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log(jobId);

    const job = await Job.findByIdAndDelete(jobId);

    if (!job) {
      return res.status(404).json({ msg: "Job not found." });
    }

    res.status(200).json({ msg: "Job deleted successfully." });
  } catch (err) {
    res.status(500).json({ msg: "Server error." });
  }
};

const findJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found." });
    }

    res.status(200).json({ job: job, msg: "Job deleted successfully." });
  } catch (err) {
    res.status(500).json({ msg: "Server error." });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      slots: { $gt: 0 },
      applicationDeadline: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    const filteredJobs = jobs.map((job) => ({
      jobId: job._id,
      title: job.jobTitle,
      employer: job.companyName,
      pay: job.pay.amount,
      frequency: job.pay.frequency,
      location: job.location,
      skills: job.requiredSkill.split(","),
      category: job.category,
      date: job.datePosted,
    }));

    res.status(200).json({
      msg: "All jobs fetched successfully",
      totalJobs: jobs.length,
      jobs: filteredJobs,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error." });
  }
};

module.exports = {
  addJob,
  applyForJob,
  getAllJobsPaginated,
  updateJob,
  getRecommendedJobs,
  cancelJobApplication,
  updateJobStatus,
  deleteJob,
  getAllJobs,
  findJob,
};
