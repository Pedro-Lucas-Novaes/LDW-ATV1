import 'express';

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      nome: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
