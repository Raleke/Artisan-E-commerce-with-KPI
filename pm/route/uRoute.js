const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authenticateUser");
const { isCustomer } = require('../middleware/isCustomer'); 


const{
    userRegistrationPost,userLoginPost,getPurchaseHistory
} = require("../controller/ucontroller");

router.post("/registration", userRegistrationPost);
router.post("/login", userLoginPost);
router.get("/user/purchaseHistory", authenticateUser, isCustomer, getPurchaseHistory);




  

module.exports = router;

