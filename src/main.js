import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa-cors';
import server from 'koa-static';

import config from 'config';
import db from 'db';
import errorHandle from 'middleware/errorHandle';
import router from 'routes';

(async () => {
  try {
    await db.sync({});
    console.info('Database connected');
  } catch (err) {
    console.err(err);
  }
})();

const app = new Koa();

app
.use(cors())
.use(server('.'))
.use(bodyParser())
.use(errorHandle())
.use(router.routes())
.use(router.allowedMethods());

app.listen(config.port);
