const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    unitLocation: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',  
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comments: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);