const asyncHandler = require('express-async-handler');
const Settings = require('../models/Settings');

// @desc    Get global settings
// @route   GET /api/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne();

    // If no settings exist, create default
    if (!settings) {
        settings = await Settings.create({});
    }

    res.json(settings);
});

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create({});
    }

    settings.registrationFee = req.body.registrationFee || settings.registrationFee;
    settings.platformName = req.body.platformName || settings.platformName;
    settings.maintenanceMode = req.body.maintenanceMode !== undefined ? req.body.maintenanceMode : settings.maintenanceMode;
    settings.language = req.body.language || settings.language;
    settings.theme = req.body.theme || settings.theme;

    const updatedSettings = await settings.save();

    res.json(updatedSettings);
});

module.exports = {
    getSettings,
    updateSettings,
};
