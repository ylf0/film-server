import Rank from 'models/rank';

import {
  request,
  query,
  body,
  summary,
  tags
} from 'koa-swagger-decorator';

const tag = tags(['Rank']);

export default class RankRouter {
  @request('post', '/rank')
  @query({
    page: { type: 'number', require: false, default: 1, description: '页码' },
    limit: { type: 'number', require: false, default: 10, description: '每页数量' },
    searchWord: { type: 'string', require: false, description: '搜索词' },
    type: { type: 'string', require: false, description: '电影类型' },
    area: { type: 'string', require: false, description: '电影区域' },
    time: { type: 'string', require: false, description: '电影时间' }
  })
  @tag
  @summary('电影排行表')
  static async getRank(ctx) {
    const { page, limit, searchWord } = ctx.validatedQuery;
    let { type, area, time } = ctx.validatedQuery;
    // console.log(`${type}${area}${time}`);
    if (type === '全部') type = '';
    if (area === '全部') area = '';
    if (time === '全部') {
      time = '';
    } else if (time === '1970') {
      time = [1900, 1969];
    } else if (time) {
      time = time.split(',');
    }

    if (searchWord) {
      const { rows: ranks } = await Rank.findAndCountAll({
        where: { title: { $like: `${searchWord}%` } },
        limit,
        order: [['order', 'ASC']]
      });
      ctx.body = { ranks };
    } else {
      const { count, rows: ranks } = await Rank.findAndCount({
        where: time ? { type: { $like: `%${type}%` }, area: { $like: `%${area}%` }, time: { $between: time } }
                    : { type: { $like: `%${type}%` }, area: { $like: `%${area}%` } },
        page,
        limit,
        offset: (page - 1) * limit,
        order: [['order', 'ASC']]
      });
      ctx.body = { count, ranks };
    }
  }

  @request('post', '/rank/add')
  @body({
    title: { type: 'string', require: true, description: '电影名' },
    director: { type: 'string', require: true, description: '导演' },
    player: { type: 'string', require: true, description: '主演' },
    type: { type: 'string', require: true, description: '类型' },
  })
  @tag
  @summary('添加电影')
  static async addRank(ctx) {
    const { title, director, player, type } = ctx.validatedBody;

    const rank = await Rank.create({
      title,
      info: `导演: ${director}  主演: ${player}`,
      type
    });

    ctx.body = { id: rank.id };
  }

}
