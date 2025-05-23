import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;
  const user = await User.findByIdAndDelete(id);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json({ message: 'User deleted' });
} 