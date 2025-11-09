import express from 'express';
import {
  getProfile,
  updateProfile,
  searchUsers,
  voteCool,
  admireUser,
  getTrendingUsers
} from '../controllers/userController';
import { authenticateToken, requireVerification } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);
router.use(requireVerification);

router.get('/profile/:id', getProfile);
router.put('/profile', updateProfile);
router.get('/search', searchUsers);
router.post('/:userId/cool', voteCool);
router.post('/:userId/admire', admireUser);
router.get('/trending', getTrendingUsers);

export default router;