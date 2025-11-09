import { Request, Response } from 'express';
import Room from '../models/Room';
import Message from '../models/Message';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

export const createRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, interests } = req.body;

    const room = new Room({
      title,
      description,
      interests,
      creator: req.user._id,
      members: [req.user._id]
    });

    await room.save();
    await room.populate('creator', 'name');

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRooms = async (req: AuthRequest, res: Response) => {
  try {
    const { interests, search } = req.query;

    let query: any = {};

    if (interests) {
      const interestsArray = (interests as string).split(',');
      query.interests = { $in: interestsArray };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const rooms = await Room.find(query)
      .populate('creator', 'name')
      .populate('members', 'name')
      .sort({ createdAt: -1 });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const joinRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.members.includes(userId)) {
      return res.status(400).json({ message: 'Already a member of this room' });
    }

    room.members.push(userId);
    await room.save();

    res.json({ message: 'Successfully joined the room' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const leaveRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    const room = await Room.findById(roomId);
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
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRoomMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not a member of this room' });
    }

    const messages = await Message.find({ room: roomId })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { roomId } = req.params;
    const { content } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not a member of this room' });
    }

    const message = new Message({
      room: roomId,
      sender: req.user._id,
      content
    });

    await message.save();
    await message.populate('sender', 'name');

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTrendingRooms = async (req: AuthRequest, res: Response) => {
  try {
    const rooms = await Room.find({})
      .populate('creator', 'name')
      .populate('members', 'name')
      .sort({ 'members.length': -1, createdAt: -1 })
      .limit(10);

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};