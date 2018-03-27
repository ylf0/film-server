import Rank from 'models/rank';

import {
  request,
  query,
  summary,
  tags
} from 'koa-swagger-decorator';

const tag = tags(['Rank']);

export default class RankRouter {
  @request('post', '/rank')
  @query({
    page: { type: 'number', require: false, default: 1, description: '页码' },
    limit: { type: 'number', require: false, default: 10, description: '每页数量' },
    searchWord: { type: 'string', require: false, description: '搜索词' }
  })
  @tag
  @summary('电影排行表')
  static async getRank(ctx) {
    const { page, limit, searchWord } = ctx.validatedQuery;

    if (searchWord) {
      const { rows: ranks } = await Rank.findAndCountAll({
        where: { title: { $like: `${searchWord}%` } },
        limit,
        order: [['order', 'ASC']]
      });
      ctx.body = { ranks };
    } else {
      const { count, rows: ranks } = await Rank.findAndCount({
        page,
        limit,
        offset: (page - 1) * limit,
        order: [['order', 'ASC']]
      });
      ctx.body = { count, ranks };
    }
  }

}
