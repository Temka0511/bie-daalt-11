import express from 'express';
import booksRouter from './routes/books';
import membersRouter from './routes/members';
import loansRouter from './routes/loans';
import reservationsRouter from './routes/reservations';
import { notFound, errorHandler } from './middleware/errorHandler';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/books', booksRouter);
app.use('/members', membersRouter);
app.use('/loans', loansRouter);
app.use('/reservations', reservationsRouter);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Library API running on http://localhost:${PORT}`));

export default app;
