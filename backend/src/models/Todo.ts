import { Schema, model, Document, Types } from 'mongoose';

export interface ITodoDocument extends Document {
  user: Types.ObjectId;
  title: string;
  description: string;
  completed: boolean;
  priority?: 'Low' | 'Medium' | 'High';
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new Schema<ITodoDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Todo title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Todo = model<ITodoDocument>('Todo', todoSchema);

export default Todo;
