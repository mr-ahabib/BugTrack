import Bug from './Bug';
import User from './user';

const applyAssociations = () => {
  // A Bug is reported by a User
  Bug.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'reporter',
    onDelete: 'CASCADE',
  });

  // A Bug may be assigned to a User
  Bug.belongsTo(User, {
    foreignKey: 'assigned_to',
    as: 'assignee',
    onDelete: 'SET NULL',
  });

  // Optional: A user may have many bugs reported
  User.hasMany(Bug, {
    foreignKey: 'user_id',
    as: 'reportedBugs',
  });

  // Optional: A user may be assigned many bugs
  User.hasMany(Bug, {
    foreignKey: 'assigned_to',
    as: 'assignedBugs',
  });
};

export default applyAssociations;
