import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  year: string;
  branch: string;
  bio?: string;
  interests: string[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
  coolVotes: mongoose.Types.ObjectId[];
  admirers: mongoose.Types.ObjectId[];
  admiredUsers: mongoose.Types.ObjectId[];
  admireCountThisWeek: number;
  lastAdmireReset: Date;
  isVerified: boolean;
  verificationToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  year: { type: String, required: true },
  branch: { type: String, required: true },
  bio: { type: String },
  interests: [{ type: String }],
  socialLinks: {
    linkedin: { type: String },
    github: { type: String },
    instagram: { type: String }
  },
  coolVotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  admirers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  admiredUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  admireCountThisWeek: { type: Number, default: 0 },
  lastAdmireReset: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String }
}, {
  timestamps: true
});

// Reset admire count weekly
userSchema.methods.resetAdmireCountIfNeeded = function() {
  const now = new Date();
  const lastReset = new Date(this.lastAdmireReset);
  const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSinceReset >= 7) {
    this.admireCountThisWeek = 0;
    this.lastAdmireReset = now;
  }
};

export default mongoose.model<IUser>('User', userSchema);