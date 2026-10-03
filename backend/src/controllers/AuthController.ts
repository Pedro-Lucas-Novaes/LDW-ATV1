import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { JWT_SECRET } from '../config/auth';

export class AuthController {
  public static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      if (
        !email ||
        typeof email !== 'string' ||
        !password ||
        typeof password !== 'string'
      ) {
        return res.status(400).json({
          erro: 'Email e senha sao obrigatorios.',
        });
      }

      const emailNormalizado = email.trim().toLowerCase();

      const user = await User.findOne({
        where: { email: emailNormalizado },
      });

      if (!user || !user.senha_hash) {
        return res.status(401).json({
          erro: 'Credenciais invalidas.',
        });
      }

      const senhaValida = await bcrypt.compare(password, user.senha_hash);

      if (!senhaValida) {
        return res.status(401).json({
          erro: 'Credenciais invalidas.',
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          nome: user.nome,
        },
        JWT_SECRET,
        {
          expiresIn: '1h',
        },
      );

      return res.status(200).json({
        mensagem: 'Login realizado com sucesso!',
        token,
      });
    } catch (error) {
      const detalhe =
        error instanceof Error ? error.message : 'Erro desconhecido';

      return res.status(500).json({
        erro: 'Erro ao realizar login',
        detalhe,
      });
    }
  }
}
