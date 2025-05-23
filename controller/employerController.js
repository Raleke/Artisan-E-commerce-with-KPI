require("dotenv").config();
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Employer = require("../models/employer");
const Artisan = require("../models/artisan");
const Job = require("../models/jobSchema");
const Message = require("../models/message");
const Reviews = require("../models/review.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg, and .png files are allowed"));
    }
  },
}).single("image");

const registerEmployer = async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      auth: {
        user: "ralekeegan@gmail.com",
        pass: "akfg isge aqkc pgfg",
      },
    },
  });

  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err.message });
    }

    const {
      email,
      password,
      companyName,
      termsAndConditions,
      companyNum,
      country,
      state,
      city,
      confirmPassword,
    } = req.body;
    console.log(req.body);

    let errors = [];
    if (
      !email ||
      !password ||
      !companyName ||
      !termsAndConditions ||
      !companyNum ||
      !country ||
      !state ||
      !city ||
      !confirmPassword
    ) {
      errors.push({ msg: "Please fill in all fields" });
    }

    if (password !== confirmPassword) {
      errors.push({ msg: "Passwords do not match" });
    }

    if (password.length < 8) {
      errors.push({ msg: "Password should be at least 8 characters" });
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      const existingEmployer = await Employer.findOne({ email });
      if (existingEmployer) {
        return res.status(400).json({ msg: "Email already registered" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newEmployer = new Employer({
        email,
        password: hashedPassword,
        CompanyName: companyName,
        termsAndConditions,
        companyNum,
        country,
        state,
        city,
        image: req.file ? req.file.filename : null,
      });

      await newEmployer.save();

      const msg = `Dear ${companyName}, your registration is successful and your details have been captured.`;

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Registration Successful",
        text: msg,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.status(201).json({ msg: "Employer registered successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server error" });
    }
  });
};

const loginEmployer = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please fill in all fields" });
  }

  try {
    const employer = await Employer.findOne({ email });
    if (!employer) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const token = jwt.sign({ id: employer._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      msg: "Login successful",
      token,
      employer: {
        id: employer._id,
        email: employer.email,
        companyName: employer.CompanyName,
        image: employer.image,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

const getJobApplications = async (req, res) => {
  const { jobId } = req.params;
  console.log(jobId);

  try {
    const job = await Job.findById(jobId).populate("applications.artisanId");
    if (!job) {
      return res.status(404).json({ msg: "Job not found." });
    }

    const jobApplications = {
      jobId: job._id,
      jobTitle: job.jobTitle,
      applications: job.applications.map((app) => ({
        artisanName: `${app.artisanId.firstName} ${app.artisanId.lastName}`,
        email: app.artisanId.email,
        phone: app.artisanId.phoneNumber,
        status: app.status,
        artisanId: app.artisanId._id,
      })),
    };

    res.status(200).json({ jobApplications });
  } catch (err) {
    console.error("Error fetching job applications:", err.message);
    res.status(500).json({ msg: "Server error." });
  }
};

const updateApplicationStatus = async (req, res) => {
  const { jobId, artisanId } = req.params;
  const { status } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found." });
    }

    const application = job.applications.find(
      (app) => app.artisanId.toString() === artisanId,
    );
    if (!application) {
      return res.status(404).json({ msg: "Artisan application not found." });
    }
    const prevStatus = application.status;

    if (status === "Employed") {
      if (job.slots <= 0) {
        return res
          .status(400)
          .json({ msg: "No available slots for this job." });
      }
      job.applications.forEach((app) => {
        if (app.artisanId.toString() !== artisanId) {
          app.status = "Pending";
        }
      });

      application.status = status;
      job.slots -= 1;
      await job.save();

      const artisan = await Artisan.findById(artisanId);
      if (!artisan) {
        return res.status(404).json({ msg: "Artisan not found." });
      }

      artisan.notifications.push({
        message: `Congratulations! You have been employed by ${job.companyName} for the position of ${job.requiredSkill}.`,
        date: new Date(),
        read: false,
      });

      await artisan.save();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ralekeegan@gmail.com",
          pass: "akfg isge aqkc pgfg",
        },
      });

      const mailOptions = {
        from: "ralekeegan@gmail.com",
        to: artisan.email,
        subject: "Employment Notification",
        text: `Congratulations ${artisan.firstName},\n\nYou have been employed by ${job.companyName} for the position of ${job.requiredSkill}.\n\nPlease report to work as instructed.\n\nRegards,\nAmbacht Casa`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    } else if (prevStatus === "Employed") {
      application.status = status;
      job.slots += 1;
      await job.save();
    } else {
      application.status = status;
      await job.save();
    }

    res.status(200).json({ msg: "Application status updated successfully." });
  } catch (err) {
    console.error("Error updating application status:", err.message);
    res.status(500).json({ msg: "Server error." });
  }
};

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const employer = await Employer.findOne({ email });

    if (!employer) return res.status(404).json({ msg: "Email not registered" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    employer.resetOTP = otp;
    employer.otpExpiry = Date.now() + 10 * 60 * 1000;

    await employer.save();

    const mailOptions = {
      from: "ralekeegan@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    };
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ralekeegan@gmail.com",
        pass: "akfg isge aqkc pgfg",
      },
    });
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ msg: "Error sending OTP" });
      }
      res.status(200).json({ msg: "OTP sent successfully" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const employer = await Employer.findOne({ email });
    console.log(email);
    console.log(otp);
    if (!employer) return res.status(404).json({ msg: "Email not registered" });
    console.log(employer);

    if (employer.resetOTP != otp || Date.now() > employer.otpExpiry) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    res.status(200).json({ msg: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const employer = await Employer.findOne({ email });

    if (!employer) return res.status(404).json({ msg: "Email not registered" });

    if (employer.resetOTP != otp || Date.now() > employer.otpExpiry) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    employer.password = await bcrypt.hash(newPassword, salt);
    employer.resetOTP = null;
    employer.otpExpiry = null;

    await employer.save();
    res.status(200).json({ msg: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
const getAllArtisans = async (req, res) => {
  try {
    const { skill, experience, location } = req.query;
    let query = {};

    if (skill) query["jobCategories.skills"] = { $regex: skill, $options: "i" };
    if (experience) query.yearsOfExperience = { $gte: Number(experience) };
    if (location)
      query.$or = [
        { country: { $regex: location, $options: "i" } },
        { state: { $regex: location, $options: "i" } },
        { city: { $regex: location, $options: "i" } },
      ];

    const artisans = await Artisan.find(query).select("-password");

    if (!artisans.length) {
      return res.status(404).json({ msg: "No artisans found." });
    }

    res.status(200).json({ artisans });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const getEmployerApplications = async (req, res) => {
  try {
    const { employerId } = req.params;
    const employer = await Employer.findById(employerId);
    if (!employer) return res.status(404).json({ msg: "Employer not found." });

    const jobs = await Job.find({ employerEmail: employer.email }).populate(
      "applications.artisanId",
    );

    const jobApplications = jobs.map((job) => ({
      jobId: job._id,
      jobTitle: job.jobTitle,
      applications: job.applications.map((app) => ({
        artisanName: `${app.artisanId.firstName} ${app.artisanId.lastName}`,
        email: app.artisanId.email,
        phone: app.artisanId.phoneNumber,
        status: app.status,
        artisanId: app.artisanId._id,
      })),
    }));

    res.status(200).json({ jobApplications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

const getEmployerProfile = async (req, res) => {
  try {
    const { employerId } = req.params;
    const employer = await Employer.findById(employerId).select("-password");
    if (!employer) return res.status(404).json({ msg: "Employer not found." });
    const reviews = await Reviews.find({ recipientId: employerId });
    const reviewed = await Reviews.find({ reviewerId: employerId });
    const job = await Job.find({ employerEmail: employer.email });
    const reviewAvg =
      reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length || 0.0;
    const no_of_rating = reviews.length;
    const no_of_jobs = job.length;
    const data = {
      ...employer,
      reviewAvg,
      jobs: job.splice(0, 3),
      no_of_rating,
      no_of_jobs,
      reviews: reviewed,
    };

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server error." });
  }
};

const updateEmployerPassword = async (req, res) => {
  try {
    const { employerId } = req.params;
    const { newPassword } = req.body;

    const employer = await Employer.findById(employerId);
    if (!employer) return res.status(404).json({ msg: "Employer not found." });

    employer.password = newPassword;
    await employer.save();

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error." });
  }
};

const contactArtisan = async (req, res) => {
  try {
    const { employerId, artisanId } = req.params;
    const { message } = req.body;

    const newMessage = new Message({
      senderId: employerId,
      recipientId: artisanId,
      message,
    });
    await newMessage.save();

    res.status(200).json({ msg: "Message sent to artisan." });
  } catch (err) {
    res.status(500).json({ msg: "Server error." });
  }
};

const getEmployerNotifications = async (req, res) => {
  try {
    const { employerId } = req.params;
    const notifications = await Notification.find({ recipientId: employerId });

    res.status(200).json({ notifications });
  } catch (err) {
    res.status(500).json({ msg: "Server error." });
  }
};

const getAllEmployers = async (req, res) => {
  try {
    const employers = await Employer.find().select("-password"); // Fetch all employers

    res.status(200).json({
      msg: "All employers fetched successfully",
      totalEmployers: employers.length,
      employers,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error." });
  }
};

module.exports = {
  registerEmployer,
  loginEmployer,
  getJobApplications,
  updateApplicationStatus,
  sendOTP,
  resetPassword,
  getAllArtisans,
  getEmployerApplications,
  getEmployerProfile,
  updateEmployerPassword,
  contactArtisan,
  getEmployerNotifications,
  getAllEmployers,
  verifyOTP,
};
