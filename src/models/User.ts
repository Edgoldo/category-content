import mongoose, { Schema, Document, CallbackError } from 'mongoose';
const bcrypt = require('bcrypt');

export interface UserDocument extends Document {
  username: string,
  email: string,
  password: string,
  role: 'admin' | 'creator' | 'reader'
}

const userSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'creator', 'reader'],
    default: 'reader'
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(this: UserDocument, next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    if (err instanceof Error)
      return next(err);
  }
});

userSchema.methods.comparePassword = async function(this: UserDocument, password: string) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model<UserDocument>('User', userSchema);

