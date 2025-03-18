// pages/api/adminLogin/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const prisma = new PrismaClient();

type Data = {
  message: string;
  token?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  // Find the admin by username
  const admin = await prisma.admin.findUnique({ where: { username } });

  if (!admin) {
    return res.status(400).json({ message: 'Admin not found' });
  }

  // Compare the password with the hashed password in the database
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Create a JWT token
  const token = jwt.sign(
    { id: admin.id, username: admin.username, role: 'admin' },
    process.env.JWT_SECRET || 'your-secret-key', // Use an environment variable for the secret
    { expiresIn: '1h' }
  );

  return res.status(200).json({ message: 'Login successful', token });
}
