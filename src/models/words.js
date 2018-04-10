import Sequelize from 'sequelize';
import moment from 'moment';

import User from 'models/user';

import db from 'db';

const Words = db.define('words', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: Sequelize.INTEGER },
  title: { type: Sequelize.STRING },
  content: { type: Sequelize.TEXT },
  likeNum: { type: Sequelize.INTEGER, defaultValue: 0 },
  collectNum: { type: Sequelize.INTEGER, defaultValue: 0 },
  isLiked: { type: Sequelize.BOOLEAN, defaultValue: false },
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

Words.belongsTo(User, { foreignKey: 'userId' });

export default Words;
