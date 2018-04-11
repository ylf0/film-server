import WordsCollect from 'models/wordsCollect';
import Words from 'models/words';

import {
  request,
  // query,
  body,
  path,
  summary,
  tags
} from 'koa-swagger-decorator';

const tag = tags(['WordsCollect']);

const wordsCollectSchema = {
  senderId: { type: 'number', required: true },
  receiverId: { type: 'number', required: true }
};

const pathParameter = {
  userId: { type: 'number', required: true, description: '当前用户 id' },
  wordsId: { type: 'number', required: true, description: '台词 id' }
};

export default class WordsCollectRouter {
  @request('post', '/collect/words/{wordsId}')
  @body(wordsCollectSchema)
  @path({ wordsId: pathParameter.wordsId })
  @tag
  @summary('台词收藏')

  static async create(ctx) {
    const { wordsId } = ctx.validatedParams;
    const { senderId, receiverId } = ctx.validatedBody;
    const { collectNum } = await Words.findOne({
      where: { id: wordsId }
    });
    let collect = null;

    const hasCollect = await WordsCollect.findOne({
      where: { senderId, wordsId }
    });

    if (hasCollect) {
      await WordsCollect.destroy({ where: { senderId, wordsId } });
    } else {
      collect = await WordsCollect.create({ senderId, receiverId, wordsId });
    }

    await Words.update(
      { collectNum: hasCollect ? collectNum - 1 : collectNum + 1 },
      { where: { id: wordsId } }
    );

    ctx.body = { collect };
  }
}
