import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database.js';
import { AuthRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'urjamitra_super_secret_key_2026';

export const registerUser = (req: Request, res: Response) => {
  const { fullName, email, mobileNumber, password, state, city, pinCode } = req.body;
  if (!fullName || !email || !password || !mobileNumber) {
    return res.status(400).json({ error: 'All primary fields are required.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const userId = `usr_${Date.now()}`;
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  db.prepare(`
    INSERT INTO users (id, full_name, email, mobile_number, password_hash, state, city, pin_code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(userId, fullName, email.toLowerCase().trim(), mobileNumber, passwordHash, state || 'Madhya Pradesh', city || 'Bhopal', pinCode || '462001');

  const token = jwt.sign({ id: userId, email, fullName, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: { id: userId, fullName, email, mobileNumber, state, city, pinCode }
  });
};

export const loginUser = (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, fullName: user.full_name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({
    token,
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      mobileNumber: user.mobile_number,
      state: user.state,
      city: user.city,
      pinCode: user.pin_code,
      role: user.role
    }
  });
};

export const getCurrentUser = (req: AuthRequest, res: Response) => {
  const user: any = db.prepare('SELECT id, full_name, email, mobile_number, state, city, pin_code, role FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
};
