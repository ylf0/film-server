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

const pathParameter = {
  id: { type: 'number', required: true, description: '影评 id' }
};

export default class LikeRouter {
  @request('post', '/like/{id}')
  @tag
  @summary('影评点赞')
  @path(pathParameter)
  @body({
    senderId: likeSchema.senderId,
    receiverId: likeSchema.receiverId
  })

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
      await Like.destroy({
        where: { senderId, reviewId: id }
      });
    } else {
      like = await Like.create({ senderId, receiverId, reviewId: id });
    }

    await Review.update(
      { likeNum: hasLike ? likeNum - 1 : likeNum + 1 },
      { where: { id } }
    );

    ctx.body = { like };
  }
}
