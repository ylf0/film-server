import Sequelize from 'sequelize';

import config from 'config';

const { host, database, user, password } = config.mysql;

let mysqlUrl;
if (password) {
  mysqlUrl = `mysql://${user}:${password}@${host}/${database}`;
} else {
  mysqlUrl = `mysql://${user}@${host}/${database}`;
}

export default new Sequelize(mysqlUrl, { logging: false });
