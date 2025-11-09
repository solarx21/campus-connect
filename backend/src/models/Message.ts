import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  room: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IMessage>('Message', messageSchema);