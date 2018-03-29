import Sequelize from 'sequelize';

import db from 'db';

const User = db.define('user', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, unique: true, allowNull: false },
  passwordHash: { type: Sequelize.STRING },
  avatar: { type: Sequelize.STRING }
});

export default User;
