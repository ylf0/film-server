import User from 'models/user';

import sha1 from 'sha1';
import exception from 'class/exception';

import {
  request,
  body,
  summary,
  tags
} from 'koa-swagger-decorator';

const tag = tags(['User']);

const userSchema = {
  name: { type: 'string', required: true },
  password: { type: 'string', required: true }
};

export default class UserRouter {
  @request('get', '/user')
  @tag
  @summary('用户列表')
  static async getAll(ctx) {
    const allUser = await User.findAll();
    ctx.body = { allUser };
  }

  @request('post', '/user/register')
  @tag
  @summary('用户注册')
  @body(userSchema)
  static async register(ctx) {
    const { name, password } = ctx.validatedBody;

    // 判断用户名是否重复；
    let user = await User.findOne({ where: { name } });
    if (user) throw new exception.ForbiddenError('该用户名已存在');

    user = await User.create({
      name,
      passwordHash: sha1(password)
    });

    ctx.body = { user };
  }

  @request('post', '/user/login')
  @tag
  @summary('用户登录')
  @body({
    name: userSchema.name,
    password: userSchema.password
  })
  static async login(ctx) {
    const { name, password } = ctx.validatedBody;

    const user = await User.findOne({ where: { name } });
    if (!user) {
      throw new exception.ForbiddenError('该用户名不存在');
    } else if (user.passwordHash !== sha1(password)) {
      throw new exception.ForbiddenError('密码错误');
    }

    await user.save();

    ctx.body = { user };
  }
}
