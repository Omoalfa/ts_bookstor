import { JWT_SECRET } from '@/Config';
import jwt from 'jsonwebtoken';

export const generateToken = (data: { email: string, id: number }): string => {
  return jwt.sign(data, JWT_SECRET);
}

export const decodeToken = (token: string): { email: string, id: number } => {
  return jwt.decode(token) as { email: string, id: number };
}
