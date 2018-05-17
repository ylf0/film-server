import Sequelize from 'sequelize';

import config from 'config';

const { host, database, user, password } = config.mysql;

let mysqlUrl;
console.log(host);
console.log(database);
console.log(user);
if (password) {
  mysqlUrl = `mysql://${user}:${password}@${host}/${database}`;
} else {
  mysqlUrl = `mysql://${user}@${host}/${database}`;
}

export default new Sequelize(mysqlUrl, { logging: false, timezone: '+08:00' });
