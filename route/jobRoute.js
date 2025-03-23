const express = require("express");
const router = express.Router();
const {
  addJob,
  applyForJob,
  updateJob,
  getRecommendedJobs,
  cancelJobApplication,
  updateJobStatus,
  getAllJobs,
  getAllJobsPaginated,
  deleteJob,
  findJob,
} = require("../controller/jobController");

router.post("/add-job", addJob);

router.post("/apply-job", applyForJob);

router.put("/update/:jobId", updateJob);
router.get("/get/:jobId", findJob);

router.get("/recommended/:artisanId", getRecommendedJobs);

router.put("/cancel/:jobId/:artisanId", cancelJobApplication);

router.put("/update-status/:jobId", updateJobStatus);

router.get("/jobs", getAllJobsPaginated);

router.delete("/delete/:jobId", deleteJob);

router.get("/all", getAllJobs);

module.exports = router;
