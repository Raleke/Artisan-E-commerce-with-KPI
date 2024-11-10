const express = require('express');
const router = express.Router();
const { authenticateUser } = require("../middleware/authenticateUser");
const{isAdmin} = require("../middleware/authMiddleware");  
const{isCustomer} = require("../middleware/isCustomer");
const { submitFeedback, getFeedbackByUnit } = require('../controller/fcontroller');
const { getAllInventory, getAllTransactions, aggregateSales, aggregateInventory } = require('../controller/fcontroller');


router.post('/feedback', authenticateUser, isCustomer, submitFeedback);  
router.get('/feedback/:unitLocation', getFeedbackByUnit);    


router.get('/central/inventory', authenticateUser, isAdmin, getAllInventory); 
router.get('/central/transactions', authenticateUser, isAdmin, getAllTransactions); 
router.get('/central/aggregate-sales', authenticateUser, isAdmin, aggregateSales);  
router.get('/central/aggregate-inventory', authenticateUser, isAdmin, aggregateInventory); 

module.exports = router;
