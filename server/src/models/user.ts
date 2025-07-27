import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Developer', 'Reporter'),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'User',
  timestamps: true,
  underscored: true,
  tableName: 'Users'
});

export default User;