import Sequelize from 'sequelize';

import db from 'db';

const User = db.define('user', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING },
  passwordHash: { type: Sequelize.STRING },
  avatar: { type: Sequelize.STRING }
});

export default User;
