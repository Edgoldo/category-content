import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ContentDocument extends Document {
  title: string,
  description: string,
  type: 'image' | 'video' | 'text',
  url: string,
  category: Types.ObjectId,
  createdBy: Types.ObjectId
}

const contentSchema = new Schema<ContentDocument>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'text'],
  },
  url: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export const Content = mongoose.model<ContentDocument>('Content', contentSchema);
