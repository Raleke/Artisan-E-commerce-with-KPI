const express = require("express");
const router = express.Router();
const {
  leaveReview,
  editReview,
  deleteReview,
  getArtisansToRate,
  getEmployersToRate,
  getArtisansToRateCustomers,
} = require("../controller/reviewController");

router.post("/leave-review", leaveReview);
router.put("/edit-review/:reviewId", editReview);
router.delete("/delete-review/:reviewId", deleteReview);
router.get("/artisans-to-rate/:employerId", getArtisansToRate);
router.get("/employers-to-rate/:artisanId", getEmployersToRate);
router.get(
  "/artisans-to-rate-customer/:customerId",
  getArtisansToRateCustomers,
);

module.exports = router;

