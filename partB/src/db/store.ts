import { v4 as uuidv4 } from 'uuid';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  available: boolean;
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Loan {
  id: string;
  bookId: string;
  memberId: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
  extended: boolean;
}

export interface Reservation {
  id: string;
  bookId: string;
  memberId: string;
  reservedAt: string;
}

export const db = {
  books: new Map<string, Book>(),
  members: new Map<string, Member>(),
  loans: new Map<string, Loan>(),
  reservations: new Map<string, Reservation>(),
};

const b1 = uuidv4(), b2 = uuidv4(), b3 = uuidv4();
const m1 = uuidv4();

db.books.set(b1, { id: b1, title: 'Clean Code', author: 'Robert Martin', isbn: '978-0132350884', available: true, createdAt: new Date().toISOString() });
db.books.set(b2, { id: b2, title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', isbn: '978-0201616224', available: true, createdAt: new Date().toISOString() });
db.books.set(b3, { id: b3, title: 'Design Patterns', author: 'GoF', isbn: '978-0201633610', available: true, createdAt: new Date().toISOString() });
db.members.set(m1, { id: m1, name: 'Bat-Erdene', email: 'bat@example.com', createdAt: new Date().toISOString() });
