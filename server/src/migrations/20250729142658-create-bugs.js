'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Bugs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      assigned_to: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      module: {
        type: Sequelize.ENUM('Authentication', 'Dashboard', 'Reports', 'User Management', 'Notifications', 'UI/UX'),
        allowNull: false
      },
      priority: {
        type: Sequelize.ENUM('Low', 'Medium', 'High', 'Critical'),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      steps: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      expected_behavior: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      actual_behavior: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      screenshot: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Bugs');
  }
};
