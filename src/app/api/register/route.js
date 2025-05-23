import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();
    console.log('Registration attempt for:', { username, email });

    if (!username || !email || !password) {
      console.log('Missing required fields');
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');

    // Check if user already exists
    console.log('Checking for existing user...');
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user (profilePicture will use default from model)
    console.log('Creating new user...');
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });
    console.log('User created successfully:', user._id);

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { message: `Error creating user: ${error.message}` },
      { status: 500 }
    );
  }
} 