import Rank from 'models/rank';
import User from 'models/user';
import Review from 'models/review';

import {
  request,
  query,
  body,
  path,
  summary,
  tags
} from 'koa-swagger-decorator';
import { isArray } from 'util';

const tag = tags(['Rank']);

export default class RankRouter {
  @request('get', '/rank')
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
        order: [['star', 'DESC']]
      });
      ctx.body = { ranks };
    } else {
      const { count, rows: ranks } = await Rank.findAndCount({
        where: time ? { type: { $like: `%${type}%` }, area: { $like: `%${area}%` }, time: { $between: time } }
                    : { type: { $like: `%${type}%` }, area: { $like: `%${area}%` } },
        page,
        limit,
        offset: (page - 1) * limit
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

  @request('get', '/rank/recommend/{id}')
  @path({ id: { type: 'number', require: true } })
  @tag
  @summary('推荐电影')
  static async recommend(ctx) {
    const { id } = ctx.validatedParams;
    const user = await User.findById(id);
    const ids = new Set();
    const userdIds = new Set();
    let list = [];
    let recommends = [];
    const relatedDirector = new Set();
    const relatedActor = new Set();
    const result = new Set();
    const movieIds = user.movieIds.split(' ');
    console.log(movieIds);

    if (user.favor) {
      list = user.favor.split(' ');
      console.log(list);
      for (let i = 0; i < list.length; i += 1) {
        const rank = await Rank.findAll({
          where: { type: { $like: `%${list[i]}%` } }
        });
        rank.forEach(r => ids.add(r.id));
      }
      (await Review.findAll({ where: { userId: id } })).forEach(review => { userdIds.add(review.movieId); });

      (Array.from(userdIds)).forEach(used => {
        if (ids.has(used)) ids.delete(used);
      });

      movieIds.forEach(id => {
        if (ids.has(Number(id))) ids.delete(Number(id));
      });

      for (let i = 0; i < movieIds.length; i += 1) {
        const movie = await Rank.findById(Number(movieIds[i]));

        const actors = (movie.actor.split(' ')).slice(1, 4);
        console.log(actors);

        const director = await Rank.findAll({
          where: { director: { $like: `%${movie.director}%` } }
        });

        const randomNum = Math.floor(Math.random() * director.length);
        // director.forEach(d => relatedDirector.add(d.id));
        relatedDirector.add(director[randomNum].id);

        for (let i = 0; i < actors.length; i += 1) {
          const actor = await Rank.findAll({
            where: { actor: { $like: `%${actors[i]}%` } }
          });
          const randomNum = Math.floor(Math.random() * actor.length);
          // actor.forEach(a => { relatedActor.add(a.id); });
          relatedActor.add(actor[randomNum].id);
        }
      }

      const combine = (Array.from(relatedDirector).concat(Array.from(relatedActor)));

      combine.forEach(option => {
        if (ids.has(option)) result.add(option);
      });

      recommends = await Rank.findAll({
        where: { id: Array.from(result) }
      });
    } else {
      const { rows: ranks } = await Rank.findAndCount({
        limit: 6
      });
      recommends = ranks;
    }

    ctx.body = { recommends };
  }
}
