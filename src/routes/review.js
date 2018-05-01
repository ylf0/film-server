import Review from 'models/review';
import User from 'models/user';
import Rank from 'models/rank';
import Like from 'models/like';
import ReviewCollect from 'models/reviewCollect';

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
  id: { type: 'number', required: false, description: '当前用户 id' },
  movieId: { type: 'number', required: false, description: '当前电影 id' }
};

const reviewSchema = {
  userId: { type: 'number', required: true },
  movieId: { type: 'number', required: true },
  title: { type: 'string', required: true },
  content: { type: 'string', required: true }
};

export default class ReviewRouter {
  @request('get', '/review/all')
  @query({
    page: { type: 'number', required: false, default: 1 },
    limit: { type: 'number', required: false, default: 10 },
    searchWord: { type: 'string', required: false }
  })
  @tag
  @summary('获取所有影评')
  static async getAll(ctx) {
    const { page, limit, searchWord } = ctx.validatedQuery;

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: searchWord ? { title: { $like: `%${searchWord}%` } } : {},
      page,
      limit,
      offest: (page - 1) * limit
    });

    ctx.body = { count, reviews };
  }

  @request('get', '/review/{id}')
  @query({
    page: { type: 'number', required: false, default: 1 },
    limit: { type: 'number', required: false, default: 10 },
    searchWord: { type: 'string', required: false },
    type: { type: 'string', required: false }
  })
  @path({ id: pathParameter.id })
  @tag
  @summary('获取处理后的影评')
  static async getReview(ctx) {
    const { id } = ctx.validatedParams;
    const { page, limit, searchWord, type } = ctx.validatedQuery;

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: searchWord ? { title: { $like: `%${searchWord}%` } } : {},
      page,
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User },
        { model: Rank, where: type ? { type: { $like: `%${type}%` } } : {} }
      ]
    });

    // 重置，防止取消赞和收藏后依然高亮；
    reviews.forEach(review => {
      review.isLiked = false;
      review.isCollected = false;
    });

    // 找到当前用户赞和收藏过的影评并将标识符设为 true；
    (await Like.findAll({ where: { senderId: id } })).forEach(like => {
      reviews.forEach(review => {
        if (review.id === like.reviewId) review.isLiked = true;
      });
    });

    (await ReviewCollect.findAll({ where: { senderId: id } })).forEach(collect => {
      reviews.forEach(review => {
        if (review.id === collect.reviewId) review.isCollected = true;
      });
    });

    const pageCount = Math.ceil(count / limit);

    ctx.body = { pageCount, reviews };
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
  @path({ id: pathParameter.id })
  @tag
  @summary('获取当前用户的影评')
  static async gteCurrentReview(ctx) {
    const { id } = ctx.validatedParams;

    const reviews = await Review.findAll(
      { where: { userId: id } }
    );

    ctx.body = { reviews };
  }

  @request('get', '/review/{id}/count')
  @path({ id: pathParameter.id })
  @tag
  @summary('获取当前用户影评总数')
  static async getCurrentReviewCount(ctx) {
    const { id } = ctx.validatedParams;

    const count = await Review.count({ where: { userId: id } });

    ctx.body = { count };
  }

  @request('get', '/review/{id}/movie/{movieId}')
  @query({
    page: { type: 'number', required: false, default: 1 },
    limit: { type: 'number', required: false, default: 10 }
  })
  @path({ id: pathParameter.id, movieId: pathParameter.movieId })
  @tag
  @summary('获取指定电影下的影评')
  static async getMovieReview(ctx) {
    const { id, movieId } = ctx.validatedParams;
    const { page, limit } = ctx.validatedQuery;

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { movieId },
      page,
      limit,
      offest: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
      include: [{ model: User }]
    });

    // 重置，防止取消赞和收藏后依然高亮；
    reviews.forEach(review => {
      review.isLiked = false;
      review.isCollected = false;
    });

    // 找到当前用户赞和收藏过的影评并将标识符设为 true；
    (await Like.findAll({ where: { senderId: id } })).forEach(like => {
      reviews.forEach(review => {
        if (review.id === like.reviewId) review.isLiked = true;
      });
    });

    (await ReviewCollect.findAll({ where: { senderId: id } })).forEach(collect => {
      reviews.forEach(review => {
        if (review.id === collect.reviewId) review.isCollected = true;
      });
    });

    ctx.body = { count, reviews };
  }
}
