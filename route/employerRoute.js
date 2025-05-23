const express = require("express");

const {
  registerEmployer,
  loginEmployer,
  getJobApplications,
  getAllEmployers,
  updateApplicationStatus,
  sendOTP,
  resetPassword,
  getAllArtisans,
  getEmployerApplications,
  getEmployerProfile,
  updateEmployerPassword,
  contactArtisan,
  getEmployerNotifications,
  verifyOTP,
} = require("../controller/employerController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerEmployer);

router.post("/login", loginEmployer);

router.post("/forgot-password", sendOTP);

router.post("/reset-password", resetPassword);

router.post("/verify-otp", verifyOTP);

router.get("/:jobId/applications", getJobApplications);

router.patch("/:jobId/applications/:artisanId", updateApplicationStatus);

router.get("/employer/view-artisans", getAllArtisans);

router.post("/contact-artisan/:employerId/:artisanId", contactArtisan);

router.get("/employer/applications/:employerId", getEmployerApplications);

router.get("/profile/:employerId", getEmployerProfile);

router.get("/all", getAllEmployers);

router.put("/update-password/:employerId", updateEmployerPassword);

router.get("/notifications/:employerId", getEmployerNotifications);

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    msg: "Access granted",
    employer: req.employer,
  });
});

module.exports = router;
