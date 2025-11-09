"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reportController_1 = require("../controllers/reportController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.authenticateToken);
router.use(auth_1.requireVerification);
router.post('/', reportController_1.createReport);
router.get('/', reportController_1.getReports);
router.put('/:reportId/status', reportController_1.updateReportStatus);
exports.default = router;
