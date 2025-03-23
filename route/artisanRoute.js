const express = require("express");
const {
  uploadCV,
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
  getAllArtisans,
  contactEmployer,
  getArtisanMessages,
  verifyOTP,
} = require("../controller/artisanController");

const artMiddleware = require("../middleware/artMiddleware");

const router = express.Router();

router.post("/register", registerArtisan);

router.post("/login", loginArtisan);

// router.post("/upload", uploadCV);

router.put("/update-profile/:artisanId", updateArtisanProfile);

router.get("/notifications/:artisanId", getArtisanNotifications);

router.get("/job-history", artMiddleware, getJobHistory);

router.put("/deactivate", artMiddleware, deactivateAccount);

router.post("/logout", logoutArtisan);

router.post("/forgot-password", sendOTP);

router.post("/reset-password", resetPassword);

router.post("/verify-otp", verifyOTP);

router.get("/jobs/:artisanId", filterJobsByLocation);

router.get("/dashboard", artMiddleware, artisanDashboard);

router.get("/search-artisans", searchArtisans);

router.get("/search-artisans-advanced", advancedSearchArtisans);

router.get("/artisan/applied-jobs/:artisanId", getAppliedJobs);

router.get("/profile/:artisanId", getArtisanProfile);

router.post("/contact-employer/:artisanId/:employerId", contactEmployer);

router.get("/messages/:artisanId", getArtisanMessages);

router.get("/all", getAllArtisans);

router.put("/update-password/:artisanId", updateArtisanPassword);

router.get("/profile", artMiddleware, (req, res) => {
  res.json({
    msg: "Access granted",
    artisan: req.artisan,
  });
});

module.exports = router;
