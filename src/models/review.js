import Sequelize from 'sequelize';
import moment from 'moment';

import User from 'models/user';
import Rank from 'models/rank';

import db from 'db';

const Review = db.define('review', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: Sequelize.INTEGER },
  movieId: { type: Sequelize.INTEGER },
  title: { type: Sequelize.STRING },
  content: { type: Sequelize.STRING },
  likeNum: { type: Sequelize.INTEGER, defaultValue: 0 },
  commentNum: { type: Sequelize.INTEGER, defaultValue: 0 },
  collectNum: { type: Sequelize.INTEGER, defaultValue: 0 },
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

Review.belongsTo(User, { foreignKey: 'userId' });
Review.belongsTo(Rank, { foreignKey: 'movieId' });

export default Review;
