import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

export class UserController {
  // GET /api/users
  public static async index(req: Request, res: Response): Promise<Response> {
    try {
      const users = await User.findAll({
        attributes: ['id', 'nome', 'email', 'createdAt', 'updatedAt'],
      });

      return res.status(200).json(users);
    } catch (error) {
      const detalhe =
        error instanceof Error ? error.message : 'Erro desconhecido';

      return res.status(500).json({
        erro: 'Erro ao listar os usuarios',
        detalhe,
      });
    }
  }

  // GET /api/users/:id
  public static async show(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          erro: 'O ID informado deve ser um numero valido.',
        });
      }

      const user = await User.findByPk(id, {
        attributes: ['id', 'nome', 'email', 'createdAt', 'updatedAt'],
      });

      if (!user) {
        return res.status(404).json({
          erro: 'Usuario nao encontrado.',
        });
      }

      return res.status(200).json(user);
    } catch (error) {
      const detalhe =
        error instanceof Error ? error.message : 'Erro desconhecido';

      return res.status(500).json({
        erro: 'Erro ao buscar usuario',
        detalhe,
      });
    }
  }

  // POST /api/users
  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, email, password } = req.body;

      if (!nome || typeof nome !== 'string' || nome.trim() === '') {
        return res.status(400).json({
          erro: 'O campo nome e obrigatorio.',
        });
      }

      if (!email || typeof email !== 'string') {
        return res.status(400).json({
          erro: 'Informe um e-mail valido.',
        });
      }

      const emailNormalizado = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(emailNormalizado)) {
        return res.status(400).json({
          erro: 'Informe um e-mail valido.',
        });
      }

      if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({
          erro: 'A senha deve conter no minimo 6 caracteres.',
        });
      }

      const userExistente = await User.findOne({
        where: { email: emailNormalizado },
      });

      if (userExistente) {
        return res.status(409).json({
          erro: 'Ja existe um usuario cadastrado com este e-mail.',
        });
      }

      const senha_hash = await bcrypt.hash(password, 10);

      const novoUser = await User.create({
        nome: nome.trim(),
        email: emailNormalizado,
        senha_hash,
      });

      return res.status(201).json({
        id: novoUser.id,
        nome: novoUser.nome,
        email: novoUser.email,
        createdAt: novoUser.createdAt,
      });
    } catch (error) {
      const detalhe =
        error instanceof Error ? error.message : 'Erro desconhecido';

      return res.status(500).json({
        erro: 'Erro ao cadastrar usuario',
        detalhe,
      });
    }
  }

  // PUT /api/users/:id
  public static async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          erro: 'O ID informado deve ser um numero valido.',
        });
      }

      const { nome, email } = req.body;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          erro: 'Usuario nao encontrado.',
        });
      }

      if (nome !== undefined) {
        if (typeof nome !== 'string' || nome.trim() === '') {
          return res.status(400).json({
            erro: 'O campo nome deve ser um texto valido.',
          });
        }

        user.nome = nome.trim();
      }

      if (email !== undefined) {
        if (typeof email !== 'string') {
          return res.status(400).json({
            erro: 'Informe um e-mail valido.',
          });
        }

        const emailNormalizado = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(emailNormalizado)) {
          return res.status(400).json({
            erro: 'Informe um e-mail valido.',
          });
        }

        const emailEmUso = await User.findOne({
          where: { email: emailNormalizado },
        });

        if (emailEmUso && emailEmUso.id !== id) {
          return res.status(409).json({
            erro: 'Este e-mail ja esta em uso.',
          });
        }

        user.email = emailNormalizado;
      }

      await user.save();

      return res.status(200).json({
        id: user.id,
        nome: user.nome,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error) {
      const detalhe =
        error instanceof Error ? error.message : 'Erro desconhecido';

      return res.status(500).json({
        erro: 'Erro ao atualizar o usuario',
        detalhe,
      });
    }
  }

  // DELETE /api/users/:id
  public static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          erro: 'O ID informado deve ser um numero valido.',
        });
      }

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          erro: 'Usuario nao encontrado.',
        });
      }

      await user.destroy();

      return res.status(204).send();
    } catch (error) {
      const detalhe =
        error instanceof Error ? error.message : 'Erro desconhecido';

      return res.status(500).json({
        erro: 'Erro ao excluir usuario',
        detalhe,
      });
    }
  }
}
