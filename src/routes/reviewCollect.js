import ReviewCollect from 'models/reviewCollect';
import Review from 'models/review';

import {
  request,
  // query,
  body,
  path,
  summary,
  tags
} from 'koa-swagger-decorator';

const tag = tags(['ReviewCollect']);

const reviewCollectSchema = {
  senderId: { type: 'number', required: true },
  receiverId: { type: 'number', required: true },
  reviewId: { type: 'number', required: true }
};

const pathParameter = {
  userId: { type: 'number', required: true, description: '当前用户 id' },
  reviewId: { type: 'number', required: true, description: '影评 id' }
};

export default class ReviewCollectRouter {
  @request('post', '/collect/{reviewId}')
  @body({
    senderId: reviewCollectSchema.senderId,
    receiverId: reviewCollectSchema.receiverId
  })
  @path({ reviewId: pathParameter.reviewId })
  @tag
  @summary('影评收藏')

  static async create(ctx) {
    const { reviewId } = ctx.validatedParams;
    const { senderId, receiverId } = ctx.validatedBody;
    const { collectNum } = await Review.findOne({
      where: { id: reviewId }
    });
    let collect = null;

    const hasCollect = await ReviewCollect.findOne({
      where: { senderId, reviewId }
    });

    if (hasCollect) {
      await ReviewCollect.destroy({ where: { senderId, reviewId } });
    } else {
      collect = await ReviewCollect.create({ senderId, receiverId, reviewId });
    }

    await Review.update(
      { collectNum: hasCollect ? collectNum - 1 : collectNum + 1 },
      { where: { id: reviewId } }
    );

    ctx.body = { collect };
  }

  @request('get', '/collect/{userId}/all')
  @path({ userId: pathParameter.userId })
  @tag
  @summary('获取当前用户收藏过的影评和台词')
  static async getCurrentCollect(ctx) {
    const { userId } = ctx.validatedParams;

    const reviewCollect = await ReviewCollect.findAll({
      where: { senderId: userId },
      include: [{ model: Review }]
    });

    // const wordsLikes = await WordsLike.findAll({
    //   where: { senderId: userId },
    //   include: [{ model: Words }]
    // });

    ctx.body = { reviewCollect };
  }

  @request('get', '/collect/{userId}/count')
  @path({ userId: pathParameter.userId })
  @tag
  @summary('获取当前用户收藏过的总数')
  static async getCurrentLikeCount(ctx) {
    const { userId } = ctx.validatedParams;

    const reviewCount = await ReviewCollect.count({ where: { senderId: userId } });
    // const wordsCount = await WordsLike.count({ where: { senderId: userId } });

    ctx.body = { count: reviewCount };
  }
}
