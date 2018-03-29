import Review from 'models/review';
import User from 'models/user';
import Rank from 'models/rank';

import {
  request,
  query,
  body,
  summary,
  tags
} from 'koa-swagger-decorator';

const tag = tags(['Review']);

const reviewSchema = {
  userId: { type: 'number', required: true },
  movieId: { type: 'number', required: true },
  title: { type: 'string', required: true },
  content: { type: 'string', required: true }
};

export default class ReviewRouter {
  @request('get', '/review')
  @query({
    page: { type: 'number', required: false, default: 1 },
    limit: { type: 'number', required: false, default: 10 }
    // type: { type: 'string', required: false }
  })
  @tag
  @summary('获取影评')
  static async getReview(ctx) {
    const { page, limit } = ctx.validatedQuery;

    const { count, rows: reviews } = await Review.findAndCountAll({
      page,
      limit,
      offest: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User },
        { model: Rank }
      ]
    });

    const pageCount = Math.ceil(count / limit);

    ctx.body = { count, pageCount, reviews };
  }

  @request('post', '/review')
  @tag
  @summary('创建影评')
  @body(reviewSchema)
  static async create(ctx) {
    const { userId, movieId, title, content } = ctx.validatedBody;

    const review = await Review.create({
      userId,
      movieId,
      title,
      content
    });

    ctx.body = { review };
  }

}
