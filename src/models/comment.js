import Sequelize from 'sequelize';
import moment from 'moment';

import User from 'models/user';
import Review from 'models/review';

import db from 'db';

const Comment = db.define('comment', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  senderId: { type: Sequelize.INTEGER, allowNull: false },
  receiverId: { type: Sequelize.INTEGER, allowNull: false },
  reviewId: { type: Sequelize.INTEGER, allowNull: false },
  content: { type: Sequelize.TEXT, allowNull: false },
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


Comment.belongsTo(User, { foreignKey: 'receiverId' });
Comment.belongsTo(User, { foreignKey: 'senderId' });
Comment.belongsTo(Review, { foreignKey: 'reviewId' });

export default Comment;
