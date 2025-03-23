const mongoose = require("mongoose");

const contactedArtisanSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  artisanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artisan",
    required: true,
  },
  contactDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ContactedArtisan", contactedArtisanSchema);
