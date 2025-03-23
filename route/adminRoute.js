const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  getDashboardMetrics,
} = require("../controller/adminController");

router.post("/login", loginAdmin);
router.get("/metrics", getDashboardMetrics);

module.exports = router;

