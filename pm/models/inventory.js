const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({

itemName:{
    type:String,
    required:true
},

category:{
    type:String,
    required:true
},

quantity:{
    type:Number,
    required:true,
    min: 0,
},

reorderLevel:{
    type:Number,
    required:true,
    min: 0,
},

supplierInfo:{
    name: { type: String, required: true },
    contact: { type: String, required: true },
},

unitLocation:{
    type:String,
    required:true
},

businessUnit: {
    type: String,
    required: true,
},


expirationDate: {
    type: Date,
    required: false,
},
}, { timestamps: true });

module.exports = mongoose.model('inventory', inventorySchema);