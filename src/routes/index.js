import Router from 'koa-router';

import UserRouter from 'routes/user';
import RankRouter from 'routes/rank';
import ReviewRouter from 'routes/review';
import LikeRouter from 'routes/like';
import CommentRouter from 'routes/comment';

import { wrapper } from 'koa-swagger-decorator';

const router = new Router();
wrapper(router);

router.swagger({ title: 'Film', description: 'Film API Doc', version: '0.0.1' });

router.map(UserRouter);
router.map(RankRouter);
router.map(ReviewRouter);
router.map(LikeRouter);
router.map(CommentRouter);

export default router;
