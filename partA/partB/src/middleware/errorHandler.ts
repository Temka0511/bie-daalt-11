import { Request, Response, NextFunction } from 'express';

export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail?: string;
}

export function problemJson(res: Response, status: number, title: string, detail?: string): void {
  const body: ProblemDetail = {
    type: `https://library-api/errors/${title.toLowerCase().replace(/ /g, '-')}`,
    title,
    status,
    detail,
  };
  res.status(status).type('application/problem+json').json(body);
}

export function notFound(req: Request, res: Response): void {
  problemJson(res, 404, 'Not Found', `Route ${req.method} ${req.path} does not exist`);
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.error(err);
  problemJson(res, 500, 'Internal Server Error', err.message);
}
