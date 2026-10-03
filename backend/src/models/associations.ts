import { User } from './User';
import { Project } from './Project';
import { Task } from './Task';

User.hasMany(Project, {
  foreignKey: 'user_id',
  as: 'projects',
});

Project.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

Project.hasMany(Task, {
  foreignKey: 'project_id',
  as: 'tasks',
});

Task.belongsTo(Project, {
  foreignKey: 'project_id',
  as: 'project',
});
