import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';
import User from './user';

class Bug extends Model {
  assigned_to: any;
}

Bug.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  assigned_to: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  module: {
    type: DataTypes.ENUM('Authentication', 'Dashboard', 'Reports', 'User Management', 'Notifications', 'UI/UX'),
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  steps: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expected_behavior: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  actual_behavior: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  screenshot: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'Bug',
  timestamps: true,
  underscored: true,
  tableName: 'Bugs'
});

export default Bug;
