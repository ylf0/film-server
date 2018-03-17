import Sequelize from 'sequelize';

import config from 'config';
import db from 'db';

const User = db.define('user', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING }
});

export default User;
