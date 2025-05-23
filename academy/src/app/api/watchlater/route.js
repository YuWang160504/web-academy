import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import Video from '@/models/Video';
import mongoose from 'mongoose';

// Add video to watch later
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json({ error: 'Invalid video ID format' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if video exists
    const video = await Video.findById(courseId);
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Add to watch later if not already added
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const videoIdStr = courseId.toString();
    const watchLaterIds = user.watchLater.map(id => id.toString());

    if (watchLaterIds.includes(videoIdStr)) {
      return NextResponse.json({ message: 'Video already in watch later', isInWatchLater: true }, { status: 200 });
    }

    user.watchLater.push(courseId);
    await user.save();

    // Get updated watch later list with populated video details
    const updatedUser = await User.findById(user._id).populate('watchLater');

    return NextResponse.json({ 
      message: 'Added to watch later',
      isInWatchLater: true,
      watchLater: updatedUser.watchLater 
    }, { status: 200 });
  } catch (error) {
    console.error('Watch Later Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

// Remove video from watch later
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json({ error: 'Invalid video ID format' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const videoIdStr = courseId.toString();
    const watchLaterIds = user.watchLater.map(id => id.toString());
    const courseIndex = watchLaterIds.indexOf(videoIdStr);

    if (courseIndex === -1) {
      return NextResponse.json({ 
        message: 'Video not in watch later',
        isInWatchLater: false 
      }, { status: 200 });
    }

    // Remove from watch later
    user.watchLater.splice(courseIndex, 1);
    await user.save();

    // Get updated watch later list with populated video details
    const updatedUser = await User.findById(user._id).populate('watchLater');

    return NextResponse.json({ 
      message: 'Removed from watch later',
      isInWatchLater: false,
      watchLater: updatedUser.watchLater 
    }, { status: 200 });
  } catch (error) {
    console.error('Watch Later Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

// Get watch later list
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Find user and populate watch later list with video details
    const user = await User.findOne({ email: session.user.email }).populate({
      path: 'watchLater',
      model: 'Video',
      select: 'title description url thumbnail category instructor duration'
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      watchLater: user.watchLater,
      message: 'Watch later list retrieved successfully' 
    }, { status: 200 });
  } catch (error) {
    console.error('Watch Later Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
} 