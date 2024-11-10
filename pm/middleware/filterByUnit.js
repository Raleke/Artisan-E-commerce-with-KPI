function filterByUnit(req, res, next) {
    const { unitLocation } = req.params;
    if (!unitLocation) {
        return res.status(400).json({ error: 'Unit location is required' });
    }
    req.unitLocation = unitLocation;
    next();
}

module.exports = filterByUnit;
