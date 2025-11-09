import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  reporter: mongoose.Types.ObjectId;
  reportedUser?: mongoose.Types.ObjectId;
  reportedRoom?: mongoose.Types.ObjectId;
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>({
  reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reportedUser: { type: Schema.Types.ObjectId, ref: 'User' },
  reportedRoom: { type: Schema.Types.ObjectId, ref: 'Room' },
  reason: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'resolved', 'dismissed'], default: 'pending' }
}, {
  timestamps: true
});

export default mongoose.model<IReport>('Report', reportSchema);