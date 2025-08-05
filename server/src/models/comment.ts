import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';
import Bug from './Bug';

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bug_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Comment',
    timestamps: true,
    underscored: true,
    tableName: 'Comments',
  }
);

export default Comment;
