import Review from 'models/review';
import User from 'models/user';
import Rank from 'models/rank';
import Like from 'models/like';

import {
  request,
  query,
  body,
  path,
  summary,
  tags
} from 'koa-swagger-decorator';

const tag = tags(['Review']);

const pathParameter = {
  id: { type: 'number', required: true, description: '当前用户 id' }
};

const reviewSchema = {
  userId: { type: 'number', required: true },
  movieId: { type: 'number', required: true },
  title: { type: 'string', required: true },
  content: { type: 'string', required: true }
};

export default class ReviewRouter {
  @request('get', '/review/{id}')
  @query({
    page: { type: 'number', required: false, default: 1 },
    limit: { type: 'number', required: false, default: 10 }
    // type: { type: 'string', required: false }
  })
  @path(pathParameter)
  @tag
  @summary('获取影评')
  static async getReview(ctx) {
    const { id } = ctx.validatedParams;
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

    // 重置，防止取消赞后依然高亮；
    reviews.forEach(review => { review.isLiked = false; });

    // 找到当前用户赞过的影评并将标识符设为 true；
    (await Like.findAll({ where: { senderId: id } })).forEach(like => {
      reviews.forEach(review => {
        if (review.id === like.reviewId) review.isLiked = true;
      });
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

  @request('get', '/review/{id}/all')
  @path(pathParameter)
  @tag
  @summary('获取当前用户的影评')
  static async gteCurrentReview(ctx) {
    const { id } = ctx.validatedParams;

    const reviews = await Review.findAll(
      { where: { userId: id } }
    );

    ctx.body = { reviews };
  }

  @request('GET', '/review/{id}/count')
  @path(pathParameter)
  @tag
  @summary('获取当前用户赞过的总数')
  static async getCurrentReviewCount(ctx) {
    const { id } = ctx.validatedParams;

    const count = await Review.count({ where: { userId: id } });

    ctx.body = { count };
  }
}
