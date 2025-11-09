import express from 'express';
import {
  createRoom,
  getRooms,
  joinRoom,
  leaveRoom,
  getRoomMessages,
  sendMessage,
  getTrendingRooms
} from '../controllers/roomController';
import { authenticateToken, requireVerification } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);
router.use(requireVerification);

router.post('/', createRoom);
router.get('/', getRooms);
router.post('/:roomId/join', joinRoom);
router.post('/:roomId/leave', leaveRoom);
router.get('/:roomId/messages', getRoomMessages);
router.post('/:roomId/messages', sendMessage);
router.get('/trending', getTrendingRooms);

export default router;