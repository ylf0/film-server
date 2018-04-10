import Words from 'models/words';
import User from 'models/user';
import Like from 'models/like';

import {
  request,
  query,
  body,
  path,
  summary,
  tags
} from 'koa-swagger-decorator';

const tag = tags(['Words']);

const pathParameter = {
  id: { type: 'number', required: true, description: '当前用户 ID' }
};

const wordsSchema = {
  userId: { type: 'number', required: true },
  title: { type: 'string', required: true },
  content: { type: 'string', required: true }
};

export default class WordsRouter {
  @request('get', '/words/{id}')
  @query({
    page: { type: 'number', required: false, default: 1 },
    limit: { type: 'number', required: false, default: 10 }
  })
  @path(pathParameter)
  @tag
  @summary('获取台词')
  static async getWords(ctx) {
    const { id } = ctx.validatedParams;
    const { page, limit } = ctx.validatedQuery;

    const { count, rows: words } = await Words.findAndCountAll({
      page,
      limit,
      offest: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
      include: [{ model: User }]
    });

    words.forEach(word => { word.isLiked = false; });

    (await Like.findAll({ where: { senderId: id, wordsId: { $not: 0 } } })).forEach(like => {
      words.forEach(word => {
        if (word.id === like.wordsId) word.isLiked = true;
      });
    });

    const pageCount = Math.ceil(count / limit);

    ctx.body = { pageCount, words };
  }

  @request('post', '/words')
  @body(wordsSchema)
  @tag
  @summary('创建台词')
  static async create(ctx) {
    const { userId, title, content } = ctx.validatedBody;

    const words = await Words.create({
      userId,
      title,
      content
    });

    ctx.body = { words };
  }
}
