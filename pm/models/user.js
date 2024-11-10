const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },

    role:{
    type:String,
     enum: ['Admin', 'Customer'],
        default: 'Customer'
    },

    purchaseHistory: [
        {
            transactionId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Transaction' 
            },
            amountSpent: Number,
            date: Date
        }
    ]


}, { timestamps: true }); 

module.exports = new mongoose.model("user",userSchema);