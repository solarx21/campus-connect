import mongoose, { Document, Schema } from 'mongoose';

export interface IRoom extends Document {
  title: string;
  description: string;
  interests: string[];
  creator: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema<IRoom>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  interests: [{ type: String, required: true }],
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
}, {
  timestamps: true
});

export default mongoose.model<IRoom>('Room', roomSchema);