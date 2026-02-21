const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
    category: {
        type: String,
        enum: ['coding', 'aptitude', 'core', 'softskills'],
        required: true
    },
    subCategory: { type: String },
    count: { type: Number, default: 1 },
    durationMinutes: { type: Number, default: 0 },
    source: { type: String },
    loggedDate: { type: Date, default: Date.now, required: true }
}, { timestamps: true });

activitySchema.index({ userId: 1, loggedDate: -1 });
activitySchema.index({ collegeId: 1 });
activitySchema.index({ category: 1 });

module.exports = mongoose.model('Activity', activitySchema);
