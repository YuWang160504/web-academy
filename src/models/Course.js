import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Course title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    enum: ['frontend', 'backend', 'frameworks']
  },
  url: {
    type: String,
    required: [true, 'Course URL is required'],
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

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

export default Course; 