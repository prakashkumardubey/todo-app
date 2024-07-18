import mongoose, { Schema } from 'mongoose';


const taskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  dueDate: {
    type: Date,
    default: null
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  tags: {
    type: Schema.Types.ObjectId,
    ref: 'Tag',
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
},{
    timestamps: true
});

export const Task = mongoose.model('Task', taskSchema);