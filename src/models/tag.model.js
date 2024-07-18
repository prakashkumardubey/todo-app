import mongoose, { Schema } from 'mongoose';


const tagSchema= new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: ''
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export const Tag = mongoose.model('Tag', tagSchema);