const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    businessUnit: String,
    adminId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    },
    items: [
        {
            itemName: String,
            quantity: Number,
            price: Number
        }
    ],
    totalAmount: Number,  
    paymentMethod: {
        type: String,
        enum: ["Cash", "Credit Card", "Mobile Payment", "Bank Transfer"],
        default: "Cash"
    },
    transactionDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ["Completed", "Pending", "Refunded"],
        default: "Completed"
    },
    unitLocation: { 
        type: String,
        required: true
    }
}, { timestamps: true }); 

TransactionSchema.pre('save', function(next) {
    let totalAmount = 0;
    this.items.forEach(item => {
        totalAmount += item.price * item.quantity;
    });
    this.totalAmount = totalAmount;  
    next();
});

module.exports = mongoose.model('Transaction', TransactionSchema);
