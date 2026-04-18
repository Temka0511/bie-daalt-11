import { Request, Response, NextFunction } from 'express';

export function problemJson(res: Response, status: number, title: string, detail?: string): void {
  res.status(status).type('application/problem+json').json({
    type: `https://library-api/errors/${title.toLowerCase().replace(/ /g, '-')}`,
    title,
    status,
    detail,
  });
}

export function notFound(req: Request, res: Response): void {
  problemJson(res, 404, 'Not Found', `Route ${req.method} ${req.path} does not exist`);
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  problemJson(res, 500, 'Internal Server Error', err.message);
}
