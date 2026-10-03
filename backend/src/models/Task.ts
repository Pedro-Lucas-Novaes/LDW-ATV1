import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Task extends Model {
  declare id: number;
  declare titulo: string;
  declare descricao: string | null;
  declare status: string;
  declare prioridade: string;
  declare project_id: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'pendente',
    },

    prioridade: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'media',
    },

    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'tasks',
    timestamps: true,
  },
);
