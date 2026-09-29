import { Request, Response } from 'express';

import { Project } from '../models/Project';

export class ProjectController {
  // GET /api/projects
  public static async index(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          erro: 'Usuário não autenticado.',
        });
      }

      const projects = await Project.findAll({
        where: {
          user_id: userId,
        },
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json(projects);
    } catch (error) {
      const detalhe =
        error instanceof Error ? error.message : 'Erro desconhecido';

      return res.status(500).json({
        erro: 'Erro ao listar projetos',
        detalhe,
      });
    }
  }

  // GET /api/projects/:id
  public static async show(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          erro: 'O ID informado deve ser um numero valido.',
        });
      }

      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          erro: 'Usuário não autenticado.',
        });
      }

      const project = await Project.findOne({
        where: {
          id,
          user_id: userId,
        },
      });

      if (!project) {
        return res.status(404).json({
          erro: 'Projeto não encontrado.',
        });
      }

      return res.status(200).json(project);
    } catch (error) {
      const detalhe =
        error instanceof Error ? error.message : 'Erro desconhecido';

      return res.status(500).json({
        erro: 'Erro ao buscar projeto',
        detalhe,
      });
    }
  }

  // POST /api/projects
  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, descricao } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          erro: 'Usuário não autenticado.',
        });
      }

      if (!nome || typeof nome !== 'string' || nome.trim() === '') {
        return res.status(400).json({
          erro: 'O campo nome é obrigatório.',
        });
      }

      const project = await Project.create({
        nome: nome.trim(),
        descricao: descricao?.trim() || null,
        user_id: userId,
      });

      return res.status(201).json(project);
    } catch (error) {
      const detalhe =
        error instanceof Error ? error.message : 'Erro desconhecido';

      return res.status(500).json({
        erro: 'Erro ao cadastrar projeto',
        detalhe,
      });
    }
  }

  // PUT /api/projects/:id
  public static async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          erro: 'O ID informado deve ser um numero valido.',
        });
      }

      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          erro: 'Usuário não autenticado.',
        });
      }

      const project = await Project.findOne({
        where: {
          id,
          user_id: userId,
        },
      });

      if (!project) {
        return res.status(404).json({
          erro: 'Projeto não encontrado.',
        });
      }

      const { nome, descricao } = req.body;

      if (nome !== undefined) {
        if (typeof nome !== 'string' || nome.trim() === '') {
          return res.status(400).json({
            erro: 'O campo nome deve ser um texto valido.',
          });
        }

        project.nome = nome.trim();
      }

      if (descricao !== undefined) {
        if (descricao !== null && typeof descricao !== 'string') {
          return res.status(400).json({
            erro: 'O campo descricao deve ser um texto valido.',
          });
        }

        project.descricao = descricao?.trim() || null;
      }

      await project.save();

      return res.status(200).json(project);
    } catch (error) {
      const detalhe =
        error instanceof Error ? error.message : 'Erro desconhecido';

      return res.status(500).json({
        erro: 'Erro ao atualizar projeto',
        detalhe,
      });
    }
  }

  // DELETE /api/projects/:id
  public static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          erro: 'O ID informado deve ser um numero valido.',
        });
      }

      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          erro: 'Usuário não autenticado.',
        });
      }

      const project = await Project.findOne({
        where: {
          id,
          user_id: userId,
        },
      });

      if (!project) {
        return res.status(404).json({
          erro: 'Projeto não encontrado.',
        });
      }

      await project.destroy();

      return res.status(204).send();
    } catch (error) {
      const detalhe =
        error instanceof Error ? error.message : 'Erro desconhecido';

      return res.status(500).json({
        erro: 'Erro ao excluir projeto',
        detalhe,
      });
    }
  }
}
