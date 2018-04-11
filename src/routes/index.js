import Router from 'koa-router';

import UserRouter from 'routes/user';
import RankRouter from 'routes/rank';
import ReviewRouter from 'routes/review';
import LikeRouter from 'routes/like';
import CommentRouter from 'routes/comment';
import WordsRouter from 'routes/words';
import WordsLikeRouter from 'routes/wordsLike';
import ReviewCollect from 'routes/reviewCollect';
import WordsCollect from 'routes/wordsCollect';

import { wrapper } from 'koa-swagger-decorator';

import auth from 'middleware/auth';

const router = new Router();
wrapper(router);

router.swagger({ title: 'Film', description: 'Film API Doc', version: '0.0.1' });

router.use(auth({ excludes: ['/user/login'] }));
router.map(UserRouter);
router.map(RankRouter);
router.map(ReviewRouter);
router.map(LikeRouter);
router.map(CommentRouter);
router.map(WordsRouter);
router.map(WordsLikeRouter);
router.map(ReviewCollect);
router.map(WordsCollect);

export default router;
