import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const user = await prisma.user.findFirst({ where: { role: 'admin' } });

  if (!user) {
    return NextResponse.json({ message: 'Admin not found' }, { status: 400 });
  }

  if (!user.password) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
  }

  const token = jwt.sign(
    { id: user.id, username: user.name, role: 'admin' },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' }
  );

  const response = NextResponse.json({ message: 'Login successful' });
  response.cookies.set('token', token, { 
    httpOnly: true, 
    path: '/', 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict' 
  });

  return response;
}
