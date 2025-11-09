import express from 'express';
import { createReport, getReports, updateReportStatus } from '../controllers/reportController';
import { authenticateToken, requireVerification } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);
router.use(requireVerification);

router.post('/', createReport);
router.get('/', getReports);
router.put('/:reportId/status', updateReportStatus);

export default router;