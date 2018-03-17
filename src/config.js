const env = process.env.NODE_ENV;
const common = {
  baseUrl: 'http://127.0.0.1:3000',
  mysql: {}
};
const config = {
  develop: {
    port: 3000,
    baseUrl: 'http://127.0.0.1:3000',
    mysql: {
      host: '127.0.0.1',
      database: 'film',
      user: 'root',
      password: ''
    }
  },
  production: {
    port: 3000,
    baseUrl: 'http://127.0.0.1:3000',
    mysql: {
      host: 'localhost',
      database: 'film',
      user: 'root',
      password: 'zhinan'
    }
  },
  deploy: {
    port: 3000,
    baseUrl: 'http://127.0.0.1:3000',
    mysql: {
      host: 'localhost',
      database: 'film',
      user: 'root',
      password: 'zhinan'
    }
  }
};

export default Object.assign(common, config[env]);
