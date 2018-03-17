import User from 'models/user';

import {
  request,
  summary,
  tags
} from 'koa-swagger-decorator';

const tag = tags(['User']);

export default class UserRouter {
  @request('get', '/user')
  @tag
  @summary('用户列表')
  static async getAll(ctx) {
    const allUser = await User.findAll();
    ctx.body = { allUser };
  }
}
