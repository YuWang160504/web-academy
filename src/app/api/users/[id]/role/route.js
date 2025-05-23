import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  const { role } = await req.json();
  if (!['user', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }
  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json({ user });
} 