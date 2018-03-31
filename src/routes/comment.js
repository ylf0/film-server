import Comment from 'models/comment';
import Review from 'models/review';
import User from 'models/user';

import {
  request,
  query,
  body,
  path,
  summary,
  tags
} from 'koa-swagger-decorator';

const tag = tags(['Comment']);

const commentSchema = {
  senderId: { type: 'number', required: true },
  receiverId: { type: 'number', required: true },
  reviewId: { type: 'number', required: true },
  content: { type: 'string', required: true }
};

const pathParameter = {
  id: { type: 'number', required: true, description: '影评 id' }
};

export default class CommentRouter {
  @request('get', '/comment/{id}')
  @query({
    page: { type: 'number', required: false, default: 1 },
    limit: { type: 'number', required: false, default: 10 }
  })
  @path(pathParameter)
  @tag
  @summary('评论列表')
  static async getComment(ctx) {
    const { id } = ctx.validatedParams;
    const { page, limit } = ctx.validatedQuery;

    const { count, rows: comments } = await Comment.findAndCountAll({
      where: { reviewId: id },
      include: [{ all: true }],
      page,
      limit,
      offset: (page - 1) * limit,
      order: [['updatedAt', 'DESC']]
    });

    ctx.body = { count, comments };
  }

  @request('post', '/comment/{id}')
  @body({
    senderId: commentSchema.senderId,
    receiverId: commentSchema.receiverId,
    content: commentSchema.content
  })
  @path(pathParameter)
  @tag
  @summary('影评评论')

  static async create(ctx) {
    const { id } = ctx.validatedParams;
    const { senderId, receiverId, content } = ctx.validatedBody;

    const { commentNum } = await Review.findById(id);

    const comment = await Comment.create({ senderId, receiverId, reviewId: id, content });
    await Review.update(
      { commentNum: commentNum + 1 },
      { where: { id } }
    );

    ctx.body = { comment };
  }
}
