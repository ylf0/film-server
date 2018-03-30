import Comment from 'models/comment';
import Review from 'models/review';

import {
  request,
  // query,
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
