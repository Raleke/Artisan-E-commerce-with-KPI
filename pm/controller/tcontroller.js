const Transaction = require('../models/transaction');

const recordTransaction = async (req, res) => {
    try {
        const { businessUnit, adminId, items, totalAmount, paymentMethod, unitLocation, status } = req.body;

        
        const transaction = new Transaction({
            businessUnit,
            adminId,
            items,
            totalAmount,
            paymentMethod,
            unitLocation,
            status
        });

       
        await transaction.save();
        
       
        res.status(201).json({ message: 'Transaction recorded successfully', transaction });
    } catch (error) {
        console.error('Error recording transaction:', error);
        res.status(500).json({ message: 'Failed to record transaction', error: error.message });
    }
};

const getTransactionsByLocation = async (req, res) => {
    try {
        const { unitLocation } = req.params;

       
        const transactions = await Transaction.find({ unitLocation });

        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found for this location' });
        }

       
        res.status(200).json({ transactions });
    } catch (error) {
        console.error('Error fetching transactions by location:', error);
        res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
    }
};


const getAllTransactions = async (req, res) => {
    try {
        
        const transactions = await Transaction.find();

        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found' });
        }

        
        res.status(200).json({ transactions });
    } catch (error) {
        console.error('Error fetching all transactions:', error);
        res.status(500).json({ message: 'Failed to fetch all transactions', error: error.message });
    }
};

module.exports = {
    recordTransaction,
    getTransactionsByLocation,
    getAllTransactions
};
