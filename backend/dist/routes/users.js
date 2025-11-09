"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.authenticateToken);
router.use(auth_1.requireVerification);
router.get('/profile/:id', userController_1.getProfile);
router.put('/profile', userController_1.updateProfile);
router.get('/search', userController_1.searchUsers);
router.post('/:userId/cool', userController_1.voteCool);
router.post('/:userId/admire', userController_1.admireUser);
router.get('/trending', userController_1.getTrendingUsers);
exports.default = router;
