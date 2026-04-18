import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db, Book } from '../db/store';
import { problemJson } from '../middleware/errorHandler';

const router = Router();

// GET /books — жагсаалт + хайлт + pagination
router.get('/', (req: Request, res: Response) => {
  let books = Array.from(db.books.values());

  // Filtering
  if (req.query.author) {
    books = books.filter(b => b.author.toLowerCase().includes((req.query.author as string).toLowerCase()));
  }
  if (req.query.available) {
    books = books.filter(b => b.available === (req.query.available === 'true'));
  }

  // Sorting
  const sort = req.query.sort as string;
  if (sort === 'title') books.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === 'author') books.sort((a, b) => a.author.localeCompare(b.author));

  // Pagination
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, parseInt(req.query.limit as string) || 10);
  const total = books.length;
  const data = books.slice((page - 1) * limit, page * limit);

  res.json({ data, page, limit, total });
});

// GET /books/:id
router.get('/:id', (req: Request, res: Response) => {
  const book = db.books.get(req.params.id);
  if (!book) return problemJson(res, 404, 'Not Found', `Book ${req.params.id} not found`);
  res.json(book);
});

// POST /books
router.post('/', (req: Request, res: Response) => {
  const { title, author, isbn } = req.body;
  if (!title || !author || !isbn) {
    return problemJson(res, 422, 'Unprocessable Entity', 'title, author, isbn are required');
  }
  const book: Book = { id: uuidv4(), title, author, isbn, available: true, createdAt: new Date().toISOString() };
  db.books.set(book.id, book);
  res.status(201).json(book);
});

// PATCH /books/:id
router.patch('/:id', (req: Request, res: Response) => {
  const book = db.books.get(req.params.id);
  if (!book) return problemJson(res, 404, 'Not Found', `Book ${req.params.id} not found`);
  const updated = { ...book, ...req.body, id: book.id };
  db.books.set(book.id, updated);
  res.json(updated);
});

// DELETE /books/:id
router.delete('/:id', (req: Request, res: Response) => {
  if (!db.books.has(req.params.id)) {
    return problemJson(res, 404, 'Not Found', `Book ${req.params.id} not found`);
  }
  db.books.delete(req.params.id);
  res.status(204).send();
});

export default router;
