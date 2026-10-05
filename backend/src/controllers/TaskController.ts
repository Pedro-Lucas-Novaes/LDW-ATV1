import { Request, Response } from 'express';
import { Task } from '../models/Task';
import { Project } from '../models/Project';

export class TaskController {
  // GET /api/tasks
  public static async index(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          erro: 'Usuário não autenticado..',
        });
      }

      const tasks = await Task.findAll({
        include: [
          {
            model: Project,
            as: 'project',
            where: {
              user_id: userId,
            },
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json(tasks);
    } catch (error) {
      const detalhe =
        error instanceof Error ? error.message : 'Erro desconhecido';

      return res.status(500).json({
        erro: 'Erro ao listar tarefas',
        detalhe,
      });
    }
  }

  // GET /api/tasks/:id
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

      const task = await Task.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Project,
            as: 'project',
            where: {
              user_id: userId,
            },
          },
        ],
      });

      if (!task) {
        return res.status(404).json({
          erro: 'Tarefa não encontrada.',
        });
      }

      return res.status(200).json(task);
    } catch (error) {
      const detalhe =
        error instanceof Error ? error.message : 'Erro desconhecido';

      return res.status(500).json({
        erro: 'Erro ao buscar tarefa',
        detalhe,
      });
    }
  }

  // POST /api/tasks
  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          erro: 'Usuário não autenticado.',
        });
      }

      const { titulo, descricao, status, prioridade, project_id } = req.body;

      if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
        return res.status(400).json({
          erro: 'O campo titulo é obrigatório.',
        });
      }

      if (!project_id || !Number.isInteger(Number(project_id))) {
        return res.status(400).json({
          erro: 'O project_id é obrigatório e deve ser um numero valido.',
        });
      }

      const projectId = Number(project_id);

      // Verifica se o projeto pertence ao usuário autenticado
      const project = await Project.findOne({
        where: {
          id: projectId,
          user_id: userId,
        },
      });

      if (!project) {
        return res.status(404).json({
          erro: 'Projeto não encontrado.',
        });
      }

      const statusPermitidos = ['pendente', 'em_andamento', 'concluida'];

      const prioridadePermitida = ['baixa', 'media', 'alta'];

      const statusFinal = status ?? 'pendente';
      const prioridadeFinal = prioridade ?? 'media';

      if (!statusPermitidos.includes(statusFinal)) {
        return res.status(400).json({
          erro: 'Status inválido.',
          valores_permitidos: statusPermitidos,
        });
      }

      if (!prioridadePermitida.includes(prioridadeFinal)) {
        return res.status(400).json({
          erro: 'Prioridade inválida.',
          valores_permitidos: prioridadePermitida,
        });
      }

      if (
        descricao !== undefined &&
        descricao !== null &&
        typeof descricao !== 'string'
      ) {
        return res.status(400).json({
          erro: 'O campo descricao deve ser um texto valido.',
        });
      }

      const task = await Task.create({
        titulo: titulo.trim(),
        descricao: descricao?.trim() || null,
        status: statusFinal,
        prioridade: prioridadeFinal,
        project_id: projectId,
      });

      return res.status(201).json(task);
    } catch (error) {
      const detalhe =
        error instanceof Error ? error.message : 'Erro desconhecido';

      return res.status(500).json({
        erro: 'Erro ao cadastrar tarefa',
        detalhe,
      });
    }
  }

  // PUT /api/tasks/:id
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

      const task = await Task.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Project,
            as: 'project',
            where: {
              user_id: userId,
            },
          },
        ],
      });

      if (!task) {
        return res.status(404).json({
          erro: 'Tarefa não encontrada.',
        });
      }

      const { titulo, descricao, status, prioridade, project_id } = req.body;

      if (titulo !== undefined) {
        if (typeof titulo !== 'string' || titulo.trim() === '') {
          return res.status(400).json({
            erro: 'O campo titulo deve ser um texto valido.',
          });
        }

        task.titulo = titulo.trim();
      }

      if (descricao !== undefined) {
        if (descricao !== null && typeof descricao !== 'string') {
          return res.status(400).json({
            erro: 'O campo descricao deve ser um texto valido.',
          });
        }

        task.descricao = descricao?.trim() || null;
      }

      if (status !== undefined) {
        const statusPermitidos = ['pendente', 'em_andamento', 'concluida'];

        if (!statusPermitidos.includes(status)) {
          return res.status(400).json({
            erro: 'Status inválido.',
            valores_permitidos: statusPermitidos,
          });
        }

        task.status = status;
      }

      if (prioridade !== undefined) {
        const prioridadePermitida = ['baixa', 'media', 'alta'];

        if (!prioridadePermitida.includes(prioridade)) {
          return res.status(400).json({
            erro: 'Prioridade inválida.',
            valores_permitidos: prioridadePermitida,
          });
        }

        task.prioridade = prioridade;
      }

      if (project_id !== undefined) {
        if (!Number.isInteger(Number(project_id))) {
          return res.status(400).json({
            erro: 'O project_id deve ser um numero valido.',
          });
        }

        const novoProjectId = Number(project_id);

        const project = await Project.findOne({
          where: {
            id: novoProjectId,
            user_id: userId,
          },
        });

        if (!project) {
          return res.status(404).json({
            erro: 'Novo projeto não encontrado.',
          });
        }

        task.project_id = novoProjectId;
      }

      await task.save();

      return res.status(200).json(task);
    } catch (error) {
      const detalhe =
        error instanceof Error ? error.message : 'Erro desconhecido';

      return res.status(500).json({
        erro: 'Erro ao atualizar tarefa',
        detalhe,
      });
    }
  }

  // DELETE /api/tasks/:id
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

      const task = await Task.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Project,
            as: 'project',
            where: {
              user_id: userId,
            },
          },
        ],
      });

      if (!task) {
        return res.status(404).json({
          erro: 'Tarefa não encontrada.',
        });
      }

      await task.destroy();

      return res.status(204).send();
    } catch (error) {
      const detalhe =
        error instanceof Error ? error.message : 'Erro desconhecido';

      return res.status(500).json({
        erro: 'Erro ao excluir tarefa',
        detalhe,
      });
    }
  }
}
