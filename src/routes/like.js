import Like from 'models/like';
import Review from 'models/review';

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

const reviewIdParameter = {
  id: { type: 'number', required: true, description: '影评 id' }
};

const userIdParameter = {
  userId: { type: 'number', required: true, description: '当前用户 id' }
};

export default class LikeRouter {
  @request('post', '/like/{id}')
  @body({
    senderId: likeSchema.senderId,
    receiverId: likeSchema.receiverId
  })
  @path(reviewIdParameter)
  @tag
  @summary('影评点赞')

  static async create(ctx) {
    const { id } = ctx.validatedParams;
    const { senderId, receiverId } = ctx.validatedBody;
    const { likeNum } = await Review.findOne({
      where: { id }
    });
    let like = null;

    const hasLike = await Like.findOne({
      where: { senderId, reviewId: id }
    });

    if (hasLike) {
      await Like.destroy({ where: { senderId, reviewId: id } });
    } else {
      like = await Like.create({ senderId, receiverId, reviewId: id });
    }

    await Review.update(
      { likeNum: hasLike ? likeNum - 1 : likeNum + 1 },
      { where: { id } }
    );

    ctx.body = { like };
  }

  @request('GET', '/like/{userId}/all')
  @path(userIdParameter)
  @tag
  @summary('获取当前用户赞过的影评')
  static async getCurrentLike(ctx) {
    const { userId } = ctx.validatedParams;

    const likes = await Like.findAll({
      where: { senderId: userId },
      include: [{ model: Review }]
    });

    ctx.body = { likes };
  }

  @request('GET', '/like/{userId}/count')
  @path(userIdParameter)
  @tag
  @summary('获取当前用户赞过的总数')
  static async getCurrentLikeCount(ctx) {
    const { userId } = ctx.validatedParams;

    const count = await Like.count({ where: { senderId: userId } });

    ctx.body = { count };
  }
}
