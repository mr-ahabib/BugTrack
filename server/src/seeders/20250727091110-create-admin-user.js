'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('admin123', 10); // default password

    return queryInterface.bulkInsert('Users', [{
      name: 'Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'Admin',
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', { email: 'admin@example.com' });
  }
};
