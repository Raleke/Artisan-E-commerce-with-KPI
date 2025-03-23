require("dotenv").config();
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Artisan = require("../models/artisan");
const Job = require("../models/jobSchema");
const Notification = require("../models/notification");
const Message = require("../models/message");
const nodemailer = require("nodemailer");
const review = require("../models/review");
const jobSchema = require("../models/jobSchema");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
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
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "cv", maxCount: 1 },
]);

const parseNestedFields = (req) => {
  try {
    // Parse JSON strings to objects
    req.body.jobCategories = JSON.parse(req.body.jobCategories);
    req.body.education = JSON.parse(req.body.education);
    req.body.workExperience = JSON.parse(req.body.workExperience);

    // Convert numeric fields
    req.body.yearsOfExperience = Number(req.body.yearsOfExperience);

    // Convert boolean fields
    req.body.termsAccepted = req.body.termsAccepted === "true";

    // Convert education details
    if (req.body.education.details) {
      req.body.education.details.gradYear = Number(
        req.body.education.details.gradYear,
      );
    }

    // Convert work experience details
    if (req.body.workExperience.details) {
      req.body.workExperience.details.startYear = Number(
        req.body.workExperience.details.startYear,
      );
      req.body.workExperience.details.endYear = Number(
        req.body.workExperience.details.endYear,
      );
    }
  } catch (error) {
    console.error("Parsing error:", error);
    throw new Error("Invalid data format");
  }
};

const registerArtisan = async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ralekeegan@gmail.com",
      pass: "akfg isge aqkc pgfg",
    },
  });

  upload(req, res, async (err) => {
    try {
      if (err) {
        console.error("Multer Error:", err.message);
        return res.status(400).json({ msg: err.message });
      }

      // Parse nested fields before validation
      parseNestedFields(req);
      console.log("Processed Request Body:", req.body);

      // Destructure parsed values
      const {
        firstName,
        lastName,
        email,
        gender,
        whatsappNumber,
        password,
        phoneNumber,
        streetAddress,
        city,
        state,
        country,
        dob,
        jobType,
        jobCategories,
        skills,
        yearsOfExperience,
        artisanDescription,
        education,
        workExperience,
        confirmPassword,
      } = req.body;

      console.log(workExperience);
      // Validate required fields
      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "gender",
        "whatsappNumber",
        "password",
        "phoneNumber",
        "streetAddress",
        "city",
        "state",
        "country",
        "dob",
        "jobType",
        "yearsOfExperience",
        "artisanDescription",
        "confirmPassword",
      ];

      const missingFields = requiredFields.filter((field) => !req.body[field]);
      if (missingFields.length > 0) {
        return res.status(400).json({
          msg: "Missing required fields",
          fields: missingFields,
        });
      }

      // Validate password match
      if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Passwords do not match" });
      }

      // Validate password length
      if (password.length < 8) {
        return res
          .status(400)
          .json({ msg: "Password should be at least 8 characters" });
      }

      // Check existing artisan
      const existingArtisan = await Artisan.findOne({ email });
      if (existingArtisan) {
        return res.status(400).json({ msg: "Email already registered" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new artisan
      const newArtisan = new Artisan({
        firstName,
        lastName,
        email,
        gender,
        whatsappNumber,
        password: hashedPassword,
        phoneNumber,
        streetAddress,
        city,
        state,
        country,
        dob,
        jobType,
        jobCategories,
        skills,
        yearsOfExperience,
        artisanDescription,
        education,
        workExperience,
        termsAccepted: true,
        image: req.files?.image?.[0]?.filename || null,
        cv: req.files?.cv?.[0]?.filename || null,
      });

      // Save artisan
      await newArtisan.save();

      // Send confirmation email
      const mailOptions = {
        from: "ralekeegan@gmail.com",
        to: email,
        subject: "Registration Successful",
        text: `Dear ${firstName} ${lastName}, your registration is successful.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.error("Email error:", error);
        else console.log("Email sent:", info.response);
      });

      res.status(201).json({ msg: "Registration successful" });
    } catch (error) {
      console.error("Registration error:", error);
      const statusCode = error.message.includes("validation failed")
        ? 400
        : 500;
      res.status(statusCode).json({
        msg: error.message || "Server error",
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      });
    }
  });
};

const loginArtisan = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please fill in all the fields" });
  }

  try {
    const artisan = await Artisan.findOne({ email });
    if (!artisan) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, artisan.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const token = jwt.sign({ id: artisan._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      msg: "Login successful",
      token,
      artisan: {
        id: artisan._id,
        email: artisan.email,
        image: artisan.image,
        jobCategories: artisan.jobCategories,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

const updateArtisanProfile = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) return res.status(400).json({ msg: err.message });

      const { artisanId } = req.params;
      const artisan = await Artisan.findById(artisanId);
      if (!artisan) return res.status(404).json({ msg: "Artisan not found" });

      const {
        firstName,
        lastName,
        phoneNumber,
        city,
        state,
        country,
        skills,
        jobCategories,
        whatsappNumber,
        yearsOfExperience,
        description,
        jobType,
        education,
        workExperience,
      } = req.body;

      if (firstName) artisan.firstName = firstName;
      if (lastName) artisan.lastName = lastName;
      if (phoneNumber) artisan.phoneNumber = phoneNumber;
      if (city) artisan.city = city;
      if (state) artisan.state = state;
      if (country) artisan.country = country;
      if (skills) artisan.skills = skills;
      if (jobCategories) artisan.jobCategories = JSON.parse(jobCategories);
      if (yearsOfExperience) artisan.yearsOfExperience = yearsOfExperience;
      if (description) artisan.artisanDescription = description;
      if (whatsappNumber) artisan.whatsappNumber = whatsappNumber;
      if (jobType) artisan.jobType = jobType;

      if (education) {
        artisan.education = {
          level: education.level,
          details: education.details,
        };
      }

      if (workExperience) {
        artisan.workExperience = {
          hasExperience: workExperience.hasExperience,
          details: workExperience.details,
        };
      }

      if (req.files?.image) {
        artisan.image = {
          data: req.files.image[0].buffer,
          contentType: req.files.image[0].mimetype,
        };
      }
      if (req.files?.cv) {
        artisan.cv = req.files.cv[0].buffer;
      }

      await artisan.save();
      res.status(200).json({ msg: "Profile updated successfully", artisan });
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const getJobHistory = async (req, res) => {
  try {
    const jobs = await Job.find({ artisanId: req.artisanId });
    res.status(200).json({ jobs });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const deactivateAccount = async (req, res) => {
  try {
    const artisan = await Artisan.findById(req.artisanId);
    if (!artisan) return res.status(404).json({ msg: "Artisan not found" });

    artisan.isActive = false;
    await artisan.save();
    res.status(200).json({ msg: "Account deactivated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const logoutArtisan = async (req, res) => {
  res
    .status(200)
    .json({ msg: "Logout successful. Remove token on client side." });
};

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const artisan = await Artisan.findOne({ email });

    if (!artisan) return res.status(404).json({ msg: "Email not registered" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    artisan.resetOTP = otp;
    artisan.otpExpiry = Date.now() + 10 * 60 * 1000;

    await artisan.save();

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
    res.status(500).json({ msg: "Server error" });
  }
};
const verifyOTP = async (req, res) => {
  try {
    const { email, opt } = req.body;
    const artisan = await Artisan.findOne({ email });
    if (!artisan) return res.status(404).json({ msg: "Email not registered" });
    if (artisan.resetOTP !== otp || Date.now() > artisan.otpExpiry) {
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
    const artisan = await Artisan.findOne({ email });

    if (!artisan) return res.status(404).json({ msg: "Email not registered" });

    if (artisan.resetOTP !== otp || Date.now() > artisan.otpExpiry) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    artisan.password = await bcrypt.hash(newPassword, salt);
    artisan.resetOTP = null;
    artisan.otpExpiry = null;

    await artisan.save();
    res.status(200).json({ msg: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
const filterJobsByLocation = async (req, res) => {
  try {
    const { artisanId } = req.params;
    const artisan = await Artisan.findById(artisanId);
    const { state, city, jobCategories } = artisan;
    const skills = jobCategories.reduce((acc, category) => {
      if (category.skills && category.skills.length > 0) {
        acc.push(...category.skills);
      }
      return acc;
    }, []);

    // Get all jobs
    const jobs = await Job.find({
      slots: { $gt: 0 },
      applicationDeadline: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    // Helper function to determine job relevance score
    const getJobRelevanceScore = (job) => {
      let score = 0;
      const requiredSkills = job.requiredSkill.split(",");
      // Check if artisan has required skills for the job
      const hasRequiredSkill = requiredSkills.some((skill) =>
        skills.includes(skill),
      );

      // Check location match
      const isInSameState = job.location.match(new RegExp(state, "i"));
      const isInSameCity = city && job.location.match(new RegExp(city, "i"));

      // Assign scores based on matching criteria
      if (hasRequiredSkill && (isInSameState || isInSameCity))
        score = 3; // Best match: skills + location
      else if (hasRequiredSkill)
        score = 2; // Second best: skills match
      else if (isInSameState || isInSameCity)
        score = 1; // Third best: location match
      else score = 0; // No match

      return score;
    };

    // Sort jobs by relevance score
    const sortedJobs = jobs.sort((a, b) => {
      const scoreA = getJobRelevanceScore(a);
      const scoreB = getJobRelevanceScore(b);

      // If scores are equal, sort by creation date (newest first)
      if (scoreA === scoreB) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      return scoreB - scoreA; // Higher score first
    });

    // Map jobs to the desired response format
    const filteredJobs = sortedJobs.map((job) => ({
      jobId: job._id,
      title: job.jobTitle,
      employer: job.companyName,
      pay: job.pay.amount,
      frequency: job.pay.frequency,
      location: job.location,
      requiredSkill: job.requiredSkill.split(","),
      category: job.category,
      date: job.datePosted,
    }));

    res.status(200).json({ jobs: filteredJobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

const artisanDashboard = async (req, res) => {
  try {
    const artisanId = req.artisanId;
    const totalApplications = await Job.countDocuments({
      "applications.artisanId": artisanId,
    });
    const totalResponses = await Job.countDocuments({
      "applications.artisanId": artisanId,
      "applications.status": "Employed",
    });

    res.status(200).json({
      applications: totalApplications,
      responses: totalResponses,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const searchArtisans = async (req, res) => {
  try {
    const { skill, location, experience } = req.query;
    let query = {};

    if (skill) query["jobCategories.skills"] = { $regex: skill, $options: "i" };
    if (location)
      query.$or = [
        { country: { $regex: location, $options: "i" } },
        { state: { $regex: location, $options: "i" } },
        { city: { $regex: location, $options: "i" } },
      ];
    if (experience) query.yearsOfExperience = { $gte: Number(experience) };

    const artisans = await Artisan.find(query).select("-password");

    if (artisans.length === 0) {
      return res
        .status(404)
        .json({ msg: "No artisans found in this location with this skill." });
    }

    res.status(200).json({ artisans });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const advancedSearchArtisans = async (req, res) => {
  try {
    const { skill, location, experience, jobType } = req.query;
    let query = {};

    if (skill) query["jobCategories.skills"] = { $regex: skill, $options: "i" };
    if (location)
      query.$or = [
        { country: { $regex: location, $options: "i" } },
        { state: { $regex: location, $options: "i" } },
        { city: { $regex: location, $options: "i" } },
      ];
    if (experience) query.yearsOfExperience = { $gte: Number(experience) };
    if (jobType) query.jobType = jobType;

    const artisans = await Artisan.find(query).select("-password");

    if (artisans.length === 0) {
      return res
        .status(404)
        .json({ msg: "No artisans found with the given criteria." });
    }

    res.status(200).json({ artisans });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const getAppliedJobs = async (req, res) => {
  try {
    const { artisanId } = req.params;
    console.log(artisanId);
    if (!artisanId) return res.status(404).json({ msg: "Artisan not found." });
    const jobs = await Job.find({ "applications.artisanId": artisanId });

    const filteredJobs = jobs.map((job) => ({
      jobId: job._id,
      title: job.jobTitle,
      employer: job.companyName,
      pay: job.pay.amount,
      frequency: job.pay.frequency,
      location: job.location,
      requiredSkill: job.requiredSkill,
      date: job.applications.find(
        (app) => app.artisanId.toString() === artisanId,
      )?.applicationDate,
      status: job.applications.find(
        (app) => app.artisanId.toString() === artisanId,
      )?.status,
    }));

    res.status(200).json({ jobs: filteredJobs });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const getArtisanProfile = async (req, res) => {
  try {
    const { artisanId } = req.params;
    const artisan = await Artisan.findById(artisanId).select("-password");
    if (!artisan) return res.status(404).json({ msg: "Artisan not found." });
    const reviews = await review.find({ recipientId: artisanId });
    const reviewAvg =
      reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length ||
      0.0;
    const reviewed = await review.find({ reviewerId: artisanId });
    const no_of_rating = reviews.length;
    const job_completed = jobSchema.find({
      "applications.status": "Employed",
      "applications.artisanId": artisanId,
    });
    const no_of_jobs_completed = job_completed.length;
    const data = {
      ...artisan,
      reviewAvg,
      no_of_rating,
      no_of_jobs_completed,
      reviews: reviewed,
    };
    res.status(200).json({ artisan: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
};

const updateArtisanPassword = async (req, res) => {
  try {
    const { artisanId } = req.params;
    const { newPassword } = req.body;

    const artisan = await Artisan.findById(artisanId);
    if (!artisan) return res.status(404).json({ msg: "Artisan not found." });

    artisan.password = newPassword;
    await artisan.save();

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error." });
  }
};

const getArtisanNotifications = async (req, res) => {
  try {
    const { artisanId } = req.params;
    const notifications = await Notification.find({ recipientId: artisanId });

    res.status(200).json({ notifications });
  } catch (err) {
    res.status(500).json({ msg: "Server error." });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const { artisanId } = req.params;
    const { available } = req.body;

    const artisan = await Artisan.findById(artisanId);
    if (!artisan) return res.status(404).json({ msg: "Artisan not found." });

    artisan.available = available;
    await artisan.save();

    res.status(200).json({ msg: "Availability updated successfully." });
  } catch (err) {
    res.status(500).json({ msg: "Server error." });
  }
};

const contactEmployer = async (req, res) => {
  try {
    const { artisanId, employerId } = req.params;
    const { message } = req.body;

    const newMessage = new Message({
      senderId: artisanId,
      senderType: "Artisan",
      recipientId: employerId,
      recipientType: "Employer",
      message,
    });

    await newMessage.save();

    res.status(200).json({ msg: "Message sent to employer." });
  } catch (err) {
    res.status(500).json({ msg: "Server error." });
  }
};

const getArtisanMessages = async (req, res) => {
  try {
    const { artisanId } = req.params;
    const messages = await Message.find({ senderId: artisanId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ msg: "Server error." });
  }
};

const getAllArtisans = async (req, res) => {
  try {
    const artisans = await Artisan.find().select("-password"); // Fetch all artisans

    res.status(200).json({
      msg: "All artisans fetched successfully",
      totalArtisans: artisans.length,
      artisans,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error." });
  }
};

module.exports = {
  registerArtisan,
  loginArtisan,
  updateArtisanProfile,
  getJobHistory,
  deactivateAccount,
  logoutArtisan,
  sendOTP,
  resetPassword,
  filterJobsByLocation,
  artisanDashboard,
  searchArtisans,
  advancedSearchArtisans,
  getAppliedJobs,
  getArtisanProfile,
  updateArtisanPassword,
  getArtisanNotifications,
  updateAvailability,
  contactEmployer,
  getArtisanMessages,
  getAllArtisans,
  verifyOTP,
};
