import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Project extends Model {
  declare id: number;
  declare nome: string;
  declare descricao: string | null;
  declare user_id: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },

  {
    sequelize,
    tableName: 'projects',
    timestamps: true,
  },
);
