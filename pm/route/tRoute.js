const express = require('express');
const { recordTransaction, getTransactionsByLocation, getAllTransactions } = require('../controller/tcontroller');
const { authenticateUser } = require('../middleware/authenticateUser');
const {filterByUnit} =require('../middleware/filterByUnit');
const{isAdmin} = require("../middleware/authMiddleware");

const router = express.Router();


router.post('/transaction', authenticateUser, isAdmin, recordTransaction);


router.get('/transactions/:unitLocation', authenticateUser, filterByUnit, getTransactionsByLocation);


router.get('/transactions', authenticateUser, getAllTransactions);

module.exports = router;
