import mongoose, { Schema, Document } from 'mongoose';

export interface CategoryDocument extends Document {
  name: string,
  description: string,
  image: string
}

const categorySchema = new Schema<CategoryDocument>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  }
}, {
  timestamps: true
});

export const Category = mongoose.model<CategoryDocument>('Category', categorySchema);
