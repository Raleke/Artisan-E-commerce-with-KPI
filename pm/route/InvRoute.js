const express = require('express');
const router = express.Router();
const{isAdmin} = require("../middleware/authMiddleware");
const { authenticateUser } = require("../middleware/authenticateUser");
const{
    createInventoryItem,
    getInventoryByUnit,
    updateInventoryItem,
    deleteInventoryItem,
    getCategoriesByBusinessUnit,
    getItemsByCategoryInUnit
} = require("../controller/icontroller");

router.post('/', authenticateUser,isAdmin,  createInventoryItem);
router.get('/:unitLocation', getInventoryByUnit);
router.put('/:itemName', authenticateUser, isAdmin, updateInventoryItem);
router.delete('/:itemName',  authenticateUser, isAdmin, deleteInventoryItem);
router.get('/categories', getCategoriesByBusinessUnit);
router.get('/', getItemsByCategoryInUnit);

module.exports = router;
