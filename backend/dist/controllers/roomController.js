"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrendingRooms = exports.sendMessage = exports.getRoomMessages = exports.leaveRoom = exports.joinRoom = exports.getRooms = exports.createRoom = void 0;
const Room_1 = __importDefault(require("../models/Room"));
const Message_1 = __importDefault(require("../models/Message"));
const createRoom = async (req, res) => {
    try {
        const { title, description, interests } = req.body;
        const room = new Room_1.default({
            title,
            description,
            interests,
            creator: req.user._id,
            members: [req.user._id]
        });
        await room.save();
        await room.populate('creator', 'name');
        res.status(201).json(room);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createRoom = createRoom;
const getRooms = async (req, res) => {
    try {
        const { interests, search } = req.query;
        let query = {};
        if (interests) {
            const interestsArray = interests.split(',');
            query.interests = { $in: interestsArray };
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        const rooms = await Room_1.default.find(query)
            .populate('creator', 'name')
            .populate('members', 'name')
            .sort({ createdAt: -1 });
        res.json(rooms);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getRooms = getRooms;
const joinRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user._id;
        const room = await Room_1.default.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        if (room.members.includes(userId)) {
            return res.status(400).json({ message: 'Already a member of this room' });
        }
        room.members.push(userId);
        await room.save();
        res.json({ message: 'Successfully joined the room' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.joinRoom = joinRoom;
const leaveRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user._id;
        const room = await Room_1.default.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        const memberIndex = room.members.indexOf(userId);
        if (memberIndex === -1) {
            return res.status(400).json({ message: 'Not a member of this room' });
        }
        room.members.splice(memberIndex, 1);
        await room.save();
        res.json({ message: 'Successfully left the room' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.leaveRoom = leaveRoom;
const getRoomMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Room_1.default.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        if (!room.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not a member of this room' });
        }
        const messages = await Message_1.default.find({ room: roomId })
            .populate('sender', 'name')
            .sort({ createdAt: 1 });
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getRoomMessages = getRoomMessages;
const sendMessage = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { content } = req.body;
        const room = await Room_1.default.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        if (!room.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not a member of this room' });
        }
        const message = new Message_1.default({
            room: roomId,
            sender: req.user._id,
            content
        });
        await message.save();
        await message.populate('sender', 'name');
        res.status(201).json(message);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.sendMessage = sendMessage;
const getTrendingRooms = async (req, res) => {
    try {
        const rooms = await Room_1.default.find({})
            .populate('creator', 'name')
            .populate('members', 'name')
            .sort({ 'members.length': -1, createdAt: -1 })
            .limit(10);
        res.json(rooms);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getTrendingRooms = getTrendingRooms;
