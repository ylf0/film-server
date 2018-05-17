import Sequelize from 'sequelize';

// import config from 'config';

// const { host, database, user, password } = config.mysql;

// let mysqlUrl;

// if (password) {
//   mysqlUrl = `mysql://${user}:${password}@${host}/${database}`;
// } else {
//   mysqlUrl = `mysql://${user}@${host}/${database}`;
// }

const mysqlUrl = 'mysql://root:zhinan@127.0.0.1/film';

export default new Sequelize(mysqlUrl, { logging: false, timezone: '+08:00' });
