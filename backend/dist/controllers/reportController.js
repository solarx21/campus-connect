"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReportStatus = exports.getReports = exports.createReport = void 0;
const Report_1 = __importDefault(require("../models/Report"));
const createReport = async (req, res) => {
    try {
        const { reportedUser, reportedRoom, reason, description } = req.body;
        const report = new Report_1.default({
            reporter: req.user._id,
            reportedUser,
            reportedRoom,
            reason,
            description
        });
        await report.save();
        res.status(201).json({ message: 'Report submitted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createReport = createReport;
const getReports = async (req, res) => {
    try {
        // In a real app, this would be admin-only
        const reports = await Report_1.default.find({})
            .populate('reporter', 'name email')
            .populate('reportedUser', 'name email')
            .populate('reportedRoom', 'title')
            .sort({ createdAt: -1 });
        res.json(reports);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getReports = getReports;
const updateReportStatus = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { status } = req.body;
        const report = await Report_1.default.findByIdAndUpdate(reportId, { status }, { new: true });
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json(report);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateReportStatus = updateReportStatus;
