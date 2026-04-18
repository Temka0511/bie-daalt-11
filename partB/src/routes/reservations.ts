import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db, Reservation } from '../db/store';
import { problemJson } from '../middleware/errorHandler';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ data: Array.from(db.reservations.values()) });
});

router.post('/', (req: Request, res: Response) => {
  const { bookId, memberId } = req.body;
  if (!bookId || !memberId) return problemJson(res, 422, 'Unprocessable Entity', 'bookId and memberId are required');
  if (!db.books.has(bookId)) return problemJson(res, 404, 'Not Found', `Book ${bookId} not found`);
  if (!db.members.has(memberId)) return problemJson(res, 404, 'Not Found', `Member ${memberId} not found`);
  const reservation: Reservation = { id: uuidv4(), bookId, memberId, reservedAt: new Date().toISOString() };
  db.reservations.set(reservation.id, reservation);
  res.status(201).json(reservation);
});

router.delete('/:id', (req: Request, res: Response) => {
  if (!db.reservations.has(req.params.id)) return problemJson(res, 404, 'Not Found', `Reservation ${req.params.id} not found`);
  db.reservations.delete(req.params.id);
  res.status(204).send();
});

export default router;
