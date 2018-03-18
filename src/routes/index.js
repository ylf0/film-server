import Router from 'koa-router';

import UserRouter from 'routes/user';
import RankRouter from 'routes/rank';

import { wrapper } from 'koa-swagger-decorator';

const router = new Router();
wrapper(router);

router.swagger({ title: 'Film', description: 'Film API Doc', version: '0.0.1' });

router.map(UserRouter);
router.map(RankRouter);

export default router;
