import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Video title is required'],
    trim: true,
    maxlength: [100, 'Video title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Video category is required'],
    enum: ['frontend', 'backend', 'frameworks']
  },
  url: {
    type: String,
    required: [true, 'Video URL is required'],
    trim: true
  },
  thumbnail: {
    type: String,
    required: false,
    default: '/video-placeholder.png'
  },
  instructor: {
    type: String,
    required: false
  },
  duration: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Video = mongoose.models.Video || mongoose.model('Video', videoSchema);

export default Video; 