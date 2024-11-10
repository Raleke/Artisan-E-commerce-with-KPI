const Inventory = require("../models/inventory");

const createInventoryItem = async (req, res) => {
    const { itemName, category, quantity, 
        businessUnit,reorderLevel, supplierInfo, unitLocation, expirationDate } = req.body;

    try {
        const newItem = new Inventory({
            itemName,
            category,
            quantity,
businessUnit,
            reorderLevel,
            supplierInfo,
            unitLocation,
            expirationDate,
        });

        await newItem.save();
        res.status(201).json({ message: 'Inventory item created successfully', data: newItem });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create inventory item', details: error.message });
    }
};

const getInventoryByUnit = async (req, res) => {
    const { unitLocation } = req.params;

    try {
        const items = await Inventory.find({ unitLocation });
        if (items.length === 0) {
            return res.status(404).json({ message: `No inventory found for unit: ${unitLocation}` });
        }
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch inventory', details: error.message });
    }
};

const updateInventoryItem = async (req, res) => {
    const { itemName } = req.params;  
    const updates = req.body;  

    try {
    
        const updatedItem = await Inventory.findOneAndUpdate(
            { itemName: itemName },  
            updates,  
            { new: true }  
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        res.status(200).json({
            message: 'Inventory item updated successfully',
            data: updatedItem
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to update inventory item',
            details: error.message
        });
    }
};

const deleteInventoryItem = async (req, res) => {
    const { itemName } = req.params;  

    try {
    
        const deletedItem = await Inventory.findOneAndDelete({ itemName: itemName });

        if (!deletedItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        res.status(200).json({
            message: 'Inventory item deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to delete inventory item',
            details: error.message
        });
    }
};

const getCategoriesByBusinessUnit = async (req, res) => {
    const { businessUnit } = req.query;  

    try {
        const categories = await Inventory.find({ businessUnit }).distinct('category');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
    }
};

const getItemsByCategoryInUnit = async (req, res) => {
    const { businessUnit, category } = req.query;  

    try {
        const items = await Inventory.find({ businessUnit, category });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items', details: error.message });
    }
};


module.exports = {
    createInventoryItem,
    getInventoryByUnit,
    updateInventoryItem,
    deleteInventoryItem,
    getCategoriesByBusinessUnit,
    getItemsByCategoryInUnit 
};
