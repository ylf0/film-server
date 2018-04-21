import Sequelize from 'sequelize';
import moment from 'moment';

import db from 'db';

const User = db.define('user', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, unique: true, allowNull: false },
  passwordHash: { type: Sequelize.STRING },
  avatar: { type: Sequelize.STRING, defaultValue: 'static/images/avatar.jpg' },
  cover: { type: Sequelize.STRING },
  token: { type: Sequelize.STRING },
  selected: { type: Sequelize.BOOLEAN, defaultValue: false },
  createdAt: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  updatedAt: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
    }
  }
});

export default User;
