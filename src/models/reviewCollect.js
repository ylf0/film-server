import Sequelize from 'sequelize';
import moment from 'moment';

import User from 'models/user';
import Review from 'models/review';

import db from 'db';

const ReviewCollect = db.define('review_collect', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  senderId: { type: Sequelize.INTEGER, allowNull: false },
  receiverId: { type: Sequelize.INTEGER, allowNull: false },
  reviewId: { type: Sequelize.INTEGER, allowNull: false },
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

ReviewCollect.belongsTo(User, { foreignKey: 'senderId' });
ReviewCollect.belongsTo(User, { foreignKey: 'receiverId' });
ReviewCollect.belongsTo(Review, { foreignKey: 'reviewId' });

export default ReviewCollect;
