import WordsLike from 'models/wordsLike';
import Words from 'models/words';

import {
  request,
  // query,
  body,
  path,
  summary,
  tags
} from 'koa-swagger-decorator';

const tag = tags(['WordsLike']);

const wordsLikeSchema = {
  senderId: { type: 'number', required: true },
  receiverId: { type: 'number', required: true }
};

const pathParameter = {
  userId: { type: 'number', required: true, description: '当前用户 ID' },
  wordsId: { type: 'number', required: true, description: '台词 ID' }
};

export default class WordsLikeRouter {
  @request('post', '/like/words/{wordsId}')
  @body(wordsLikeSchema)
  @path({ wordsId: pathParameter.wordsId })
  @tag
  @summary('台词点赞')

  static async create(ctx) {
    const { wordsId } = ctx.validatedParams;
    const { senderId, receiverId } = ctx.validatedBody;
    const { likeNum } = await Words.findOne({
      where: { id: wordsId }
    });
    let like = null;

    const hasLike = await WordsLike.findOne({
      where: { senderId, wordsId }
    });

    if (hasLike) {
      await WordsLike.destroy({ where: { senderId, wordsId } });
    } else {
      like = await WordsLike.create({ senderId, receiverId, wordsId });
    }

    await Words.update(
      { likeNum: hasLike ? likeNum - 1 : likeNum + 1 },
      { where: { id: wordsId } }
    );

    ctx.body = { like };
  }
}
