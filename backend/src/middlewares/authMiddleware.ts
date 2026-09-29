import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/auth';

interface UsuarioToken {
  id: number;
  email: string;
  nome: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        erro: 'Token não fornecido.',
      });
    }

    const token = authHeader.split(' ')[1];

    const usuarioDecodificado = jwt.verify(token, JWT_SECRET) as UsuarioToken;

    req.user = usuarioDecodificado;

    return next();
  } catch {
    return res.status(401).json({
      erro: 'Token invalido ou expirado.',
    });
  }
}
