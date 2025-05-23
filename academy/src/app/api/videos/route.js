import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Video from '@/models/Video';

export async function GET() {
  try {
    await dbConnect();
    const videos = await Video.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Error in GET /api/videos:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in POST /api/videos:', session);

    if (!session?.user?.role) {
      console.log('No role found in session');
      return NextResponse.json({ error: 'Unauthorized - No role found' }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      console.log('Non-admin role:', session.user.role);
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const { title, url, description, category } = await req.json();
    if (!title || !url || !category) {
      return NextResponse.json({ error: 'Title, URL, and category are required' }, { status: 400 });
    }

    await dbConnect();
    const video = await Video.create({ title, url, description, category });
    return NextResponse.json({ video });
  } catch (error) {
    console.error('Error in POST /api/videos:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 