import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db, Loan } from '../db/store';
import { problemJson } from '../middleware/errorHandler';

const router = Router();
const MAX_LOANS = 5;
const LOAN_DAYS = 14;

router.get('/', (req: Request, res: Response) => {
  let loans = Array.from(db.loans.values());
  if (req.query.memberId) loans = loans.filter(l => l.memberId === req.query.memberId);
  if (req.query.active === 'true') loans = loans.filter(l => !l.returnedAt);
  res.json({ data: loans });
});

router.get('/:id', (req: Request, res: Response) => {
  const loan = db.loans.get(req.params.id);
  if (!loan) return problemJson(res, 404, 'Not Found', `Loan ${req.params.id} not found`);
  res.json(loan);
});

router.post('/', (req: Request, res: Response) => {
  const { bookId, memberId } = req.body;
  if (!bookId || !memberId) return problemJson(res, 422, 'Unprocessable Entity', 'bookId and memberId are required');

  const book = db.books.get(bookId);
  if (!book) return problemJson(res, 404, 'Not Found', `Book ${bookId} not found`);

  const member = db.members.get(memberId);
  if (!member) return problemJson(res, 404, 'Not Found', `Member ${memberId} not found`);

  if (!book.available) return problemJson(res, 409, 'Conflict', 'Book is not available');

  const activeLoans = Array.from(db.loans.values()).filter(l => l.memberId === memberId && !l.returnedAt);
  if (activeLoans.length >= MAX_LOANS) return problemJson(res, 409, 'Conflict', `Cannot borrow more than ${MAX_LOANS} books`);

  const dueAt = new Date();
  dueAt.setDate(dueAt.getDate() + LOAN_DAYS);

  const loan: Loan = { id: uuidv4(), bookId, memberId, borrowedAt: new Date().toISOString(), dueAt: dueAt.toISOString(), returnedAt: null, extended: false };
  db.loans.set(loan.id, loan);
  db.books.set(bookId, { ...book, available: false });
  res.status(201).json(loan);
});

router.patch('/:id/return', (req: Request, res: Response) => {
  const loan = db.loans.get(req.params.id);
  if (!loan) return problemJson(res, 404, 'Not Found', `Loan ${req.params.id} not found`);
  if (loan.returnedAt) return problemJson(res, 409, 'Conflict', 'Book already returned');
  const updated = { ...loan, returnedAt: new Date().toISOString() };
  db.loans.set(loan.id, updated);
  const book = db.books.get(loan.bookId);
  if (book) db.books.set(book.id, { ...book, available: true });
  res.json(updated);
});

router.patch('/:id/extend', (req: Request, res: Response) => {
  const loan = db.loans.get(req.params.id);
  if (!loan) return problemJson(res, 404, 'Not Found', `Loan ${req.params.id} not found`);
  if (loan.returnedAt) return problemJson(res, 409, 'Conflict', 'Cannot extend returned loan');
  if (loan.extended) return problemJson(res, 409, 'Conflict', 'Loan already extended once');
  const newDue = new Date(loan.dueAt);
  newDue.setDate(newDue.getDate() + LOAN_DAYS);
  const updated = { ...loan, dueAt: newDue.toISOString(), extended: true };
  db.loans.set(loan.id, updated);
  res.json(updated);
});

export default router;
