import Sequelize from 'sequelize';

import db from 'db';

const Rank = db.define('rank', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: Sequelize.STRING },
  poster: { type: Sequelize.STRING },
  director: { type: Sequelize.STRING },
  writer: { type: Sequelize.STRING },
  actor: { type: Sequelize.TEXT },
  time: { type: Sequelize.STRING },
  area: { type: Sequelize.STRING },
  type: { type: Sequelize.STRING },
  summary: { type: Sequelize.TEXT },
  runTime: { type: Sequelize.STRING },
  star: { type: Sequelize.STRING },
  votes: { type: Sequelize.STRING },
  selected: { type: Sequelize.BOOLEAN, defaultValue: false },
});

export default Rank;
