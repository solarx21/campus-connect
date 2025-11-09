"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roomController_1 = require("../controllers/roomController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.authenticateToken);
router.use(auth_1.requireVerification);
router.post('/', roomController_1.createRoom);
router.get('/', roomController_1.getRooms);
router.post('/:roomId/join', roomController_1.joinRoom);
router.post('/:roomId/leave', roomController_1.leaveRoom);
router.get('/:roomId/messages', roomController_1.getRoomMessages);
router.post('/:roomId/messages', roomController_1.sendMessage);
router.get('/trending', roomController_1.getTrendingRooms);
exports.default = router;
