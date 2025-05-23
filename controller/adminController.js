const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Admin = require("../models/admin");
const Artisan = require("../models/artisan");
const Job = require("../models/jobSchema");
const Customer = require("../models/customer");
const Employer = require("../models/employer");
const review = require("../models/review");

// Login an admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    res.status(200).json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get consolidated dashboard KPIs
const getDashboardMetrics = async (req, res) => {
  try {
    // Total jobs & job statuses
    const totalJobs = await Job.countDocuments();

    // Count open jobs (those with application deadline in the future)
    const openJobs = await Job.countDocuments({
      $and: [
        { status: { $gt: 1 } },
        { applicationDeadline: { $lt: new Date() } },
      ],
    });
    const closedJobs = totalJobs - openJobs;

    // Total users
    const totalCustomers = await Customer.countDocuments();
    const totalEmployers = await Employer.countDocuments();
    const totalArtisans = await Artisan.countDocuments();
    const totalUsers = totalCustomers + totalEmployers + totalArtisans;

    // Top Employers by jobs posted
    const topEmployersByJobsPosted = await Job.aggregate([
      {
        $group: {
          _id: "$companyName",
          jobsPosted: { $sum: 1 },
        },
      },
      { $sort: { jobsPosted: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          companyName: "$_id",
          jobsPosted: 1,
        },
      },
    ]);

    // Top Employers by artisans employed
    const topEmployersByArtisansEmployed = await Job.aggregate([
      { $unwind: "$applications" },
      { $match: { "applications.status": "Employed" } },
      {
        $group: {
          _id: "$companyName",
          employedCount: { $sum: 1 },
        },
      },
      { $sort: { employedCount: -1 } },
      { $limit: 5 },
    ]);

    // Calculate average ratings for artisans from reviews
    const artisanRatings = await review.aggregate([
      { $match: { recipientType: "Artisan" } },
      {
        $group: {
          _id: "$recipientId",
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    // Create a Map of artisan IDs to their average ratings for faster lookup
    const artisanRatingsMap = new Map();
    artisanRatings.forEach((item) => {
      artisanRatingsMap.set(item._id.toString(), item.averageRating);
    });

    // Calculate completed jobs for artisans (jobs where they were employed)
    const completedJobsCount = await Job.aggregate([
      { $unwind: "$applications" },
      { $match: { "applications.status": "Employed" } },
      {
        $group: {
          _id: "$applications.artisanId",
          completedJobs: { $sum: 1 },
        },
      },
    ]);

    // Create a Map of artisan IDs to their completed jobs count for faster lookup
    const completedJobsMap = new Map();
    completedJobsCount.forEach((item) => {
      completedJobsMap.set(item._id.toString(), item.completedJobs);
    });

    // Get top artisans with enhanced performance metrics
    const topArtisans = await Artisan.find()
      .select("firstName lastName")
      .lean();

    // Enhance the artisan data with the completed jobs and ratings
    const topArtisansByPerformance = topArtisans.map((artisan) => {
      const artisanId = artisan._id.toString();
      return {
        ...artisan,
        completedJobs: completedJobsMap.get(artisanId) || 0,
        averageRating: artisanRatingsMap.get(artisanId) || 0,
      };
    });

    // Sort artisans by performance (completed jobs and then rating)
    topArtisansByPerformance.sort((a, b) => {
      if (b.completedJobs !== a.completedJobs) {
        return b.completedJobs - a.completedJobs;
      }
      return b.averageRating - a.averageRating;
    });

    // Take only the top 10 artisans
    const top10ArtisansByPerformance = topArtisansByPerformance.slice(0, 10);

    // Top Artisans by job applications
    const topArtisansByApplicationsAgg = await Job.aggregate([
      { $unwind: "$applications" },
      {
        $group: {
          _id: "$applications.artisanId",
          applicationCount: { $sum: 1 },
        },
      },
      { $sort: { applicationCount: -1 } },
      { $limit: 10 },
    ]);

    // Populate the artisan details
    const topArtisansByApplications = await Artisan.populate(
      topArtisansByApplicationsAgg,
      {
        path: "_id",
        select: "firstName lastName",
      },
    );

    // Get application status statistics
    const applicationStats = await Job.aggregate([
      { $unwind: "$applications" },
      {
        $group: {
          _id: "$applications.status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert to a more usable format
    const applicationStatistics = {
      totalApplications: 0,
      pendingApplications: 0,
      employedApplications: 0,
      rejectedApplications: 0,
    };

    applicationStats.forEach((stat) => {
      applicationStatistics.totalApplications += stat.count;

      if (stat._id === "Pending") {
        applicationStatistics.pendingApplications = stat.count;
      } else if (stat._id === "Employed") {
        applicationStatistics.employedApplications = stat.count;
      } else if (stat._id === "Rejected") {
        applicationStatistics.rejectedApplications = stat.count;
      }
    });

    // Get job category distribution
    const jobCategoryDistribution = await Job.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Return all metrics
    res.status(200).json({
      totalJobs,
      jobStatus: { openJobs, closedJobs },
      totalUsers: {
        customers: totalCustomers,
        employers: totalEmployers,
        artisans: totalArtisans,
        overall: totalUsers,
      },
      applications: applicationStatistics,
      topEmployers: {
        byJobsPosted: topEmployersByJobsPosted,
        byArtisansEmployed: topEmployersByArtisansEmployed,
      },
      topArtisans: {
        byPerformance: top10ArtisansByPerformance,
        byApplications: topArtisansByApplications,
      },
      jobCategories: jobCategoryDistribution,
    });
  } catch (err) {
    console.error("Error fetching dashboard metrics:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  loginAdmin,
  getDashboardMetrics,
};
