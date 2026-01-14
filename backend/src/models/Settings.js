const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
    registrationFee: {
        type: Number,
        required: true,
        default: 100
    },
    // Can add more global settings here in the future
    platformName: {
        type: String,
        default: 'AppZeto Quiz Platform'
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    language: {
        type: String,
        default: 'English (US)'
    },
    theme: {
        type: String,
        default: 'Light'
    }
}, {
    timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
