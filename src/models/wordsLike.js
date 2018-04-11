import Sequelize from 'sequelize';
import moment from 'moment';

import User from 'models/user';
import Words from 'models/words';

import db from 'db';

const WordsLike = db.define('words_like', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  senderId: { type: Sequelize.INTEGER, allowNull: false },
  receiverId: { type: Sequelize.INTEGER, allowNull: false },
  wordsId: { type: Sequelize.INTEGER, allowNull: false },
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

WordsLike.belongsTo(User, { foreignKey: 'senderId' });
WordsLike.belongsTo(User, { foreignKey: 'receiverId' });
WordsLike.belongsTo(Words, { foreignKey: 'wordsId' });

export default WordsLike;
