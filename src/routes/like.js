import Like from 'models/like';
import Review from 'models/review';
import WordsLike from 'models/wordsLike';
import Words from 'models/words';

import {
  request,
  // query,
  body,
  path,
  summary,
  tags
} from 'koa-swagger-decorator';

const tag = tags(['Like']);

const likeSchema = {
  senderId: { type: 'number', required: true },
  receiverId: { type: 'number', required: true },
  reviewId: { type: 'number', required: true }
};

const pathParameter = {
  userId: { type: 'number', required: true, description: '当前用户 id' },
  reviewId: { type: 'number', required: true, description: '影评 id' }
};

export default class LikeRouter {
  @request('post', '/like/{reviewId}')
  @body({
    senderId: likeSchema.senderId,
    receiverId: likeSchema.receiverId
  })
  @path({ reviewId: pathParameter.reviewId })
  @tag
  @summary('影评点赞')

  static async create(ctx) {
    const { reviewId } = ctx.validatedParams;
    const { senderId, receiverId } = ctx.validatedBody;
    const { likeNum } = await Review.findOne({
      where: { id: reviewId }
    });
    let like = null;

    const hasLike = await Like.findOne({
      where: { senderId, reviewId }
    });

    if (hasLike) {
      await Like.destroy({ where: { senderId, reviewId } });
    } else {
      like = await Like.create({ senderId, receiverId, reviewId });
    }

    await Review.update(
      { likeNum: hasLike ? likeNum - 1 : likeNum + 1 },
      { where: { id: reviewId } }
    );

    ctx.body = { like };
  }

  @request('get', '/like/{userId}/all')
  @path({ userId: pathParameter.userId })
  @tag
  @summary('获取当前用户赞过的影评和台词')
  static async getCurrentLike(ctx) {
    const { userId } = ctx.validatedParams;

    const reviewLikes = await Like.findAll({
      where: { senderId: userId },
      include: [{ model: Review }]
    });

    const wordsLikes = await WordsLike.findAll({
      where: { senderId: userId },
      include: [{ model: Words }]
    });

    ctx.body = { reviewLikes, wordsLikes };
  }

  @request('get', '/like/{userId}/count')
  @path({ userId: pathParameter.userId })
  @tag
  @summary('获取当前用户赞过的总数')
  static async getCurrentLikeCount(ctx) {
    const { userId } = ctx.validatedParams;

    const reviewCount = await Like.count({ where: { senderId: userId } });
    const wordsCount = await WordsLike.count({ where: { senderId: userId } });

    ctx.body = { count: reviewCount + wordsCount };
  }
}
