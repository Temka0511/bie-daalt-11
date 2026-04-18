import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db, Member } from '../db/store';
import { problemJson } from '../middleware/errorHandler';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ data: Array.from(db.members.values()) });
});

router.get('/:id', (req: Request, res: Response) => {
  const member = db.members.get(req.params.id);
  if (!member) return problemJson(res, 404, 'Not Found', `Member ${req.params.id} not found`);
  res.json(member);
});

router.post('/', (req: Request, res: Response) => {
  const { name, email } = req.body;
  if (!name || !email) return problemJson(res, 422, 'Unprocessable Entity', 'name and email are required');
  const exists = Array.from(db.members.values()).find(m => m.email === email);
  if (exists) return problemJson(res, 409, 'Conflict', `Email ${email} already registered`);
  const member: Member = { id: uuidv4(), name, email, createdAt: new Date().toISOString() };
  db.members.set(member.id, member);
  res.status(201).json(member);
});

export default router;
