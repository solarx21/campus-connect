import { Request, Response } from 'express';
import Report from '../models/Report';

interface AuthRequest extends Request {
  user?: any;
}

export const createReport = async (req: AuthRequest, res: Response) => {
  try {
    const { reportedUser, reportedRoom, reason, description } = req.body;

    const report = new Report({
      reporter: req.user._id,
      reportedUser,
      reportedRoom,
      reason,
      description
    });

    await report.save();

    res.status(201).json({ message: 'Report submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    // In a real app, this would be admin-only
    const reports = await Report.find({})
      .populate('reporter', 'name email')
      .populate('reportedUser', 'name email')
      .populate('reportedRoom', 'title')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateReportStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    const report = await Report.findByIdAndUpdate(
      reportId,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};