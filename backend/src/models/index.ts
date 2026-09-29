import { User } from './User';
import { Project } from './Project';

User.hasMany(Project, {
  foreignKey: 'user_id',
  as: 'projects',
});

Project.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

export { User, Project };
