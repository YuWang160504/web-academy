import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET() {
  await dbConnect();
  const users = await User.find({}, 'username email role');
  return NextResponse.json({ users });
} 