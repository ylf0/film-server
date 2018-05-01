import Sequelize from 'sequelize';

import db from 'db';

const Rank = db.define('rank', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  order: { type: Sequelize.INTEGER },
  title: { type: Sequelize.STRING },
  img_src: { type: Sequelize.STRING },
  info: { type: Sequelize.TEXT },
  time: { type: Sequelize.STRING },
  area: { type: Sequelize.STRING },
  type: { type: Sequelize.STRING },
  star: { type: Sequelize.STRING },
  votes: { type: Sequelize.STRING },
  quote: { type: Sequelize.TEXT },
  selected: { type: Sequelize.BOOLEAN, defaultValue: false },
});

export default Rank;
