import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'frameworks'],
    required: true,
  },
});

const Video = mongoose.models.Video || mongoose.model('Video', videoSchema);

export default Video; 