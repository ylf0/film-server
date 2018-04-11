import User from 'models/user';

import sha1 from 'sha1';
import multer from 'koa-multer';
import _path from 'path';
import exception from 'class/exception';

import config from 'config';

import { calculateToken } from 'server/user';

import {
  request,
  body,
  path,
  middlewares,
  formData,
  summary,
  tags
} from 'koa-swagger-decorator';

const tag = tags(['User']);

const userSchema = {
  name: { type: 'string', required: true },
  password: { type: 'string', required: true }
};

const pathParameter = {
  id: { type: 'number', required: true, description: '当前用户 id' }
};

const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, _path.resolve('images/'));
  },
  filename: (req, file, cb) => {
    const { name, ext } = _path.parse(file.originalname);
    cb(null, `${name}_${Date.now()}${ext}`);
  }
});

const userUpload = multer({ storage: userStorage });

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
      passwordHash: sha1(password),
      token: calculateToken()
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

    user.token = calculateToken();

    await user.save();

    ctx.body = { user };
  }

  @request('post', '/user/{id}/avatar')
  @path(pathParameter)
  @formData({
    file: { type: 'file', required: true, description: '头像文件' }
  })
  @middlewares([userUpload.single('file')])
  @tag
  @summary('用户头像上传')
  static async uploadAvatar(ctx) {
    const { id } = ctx.validatedParams;
    const user = await User.findById(id);
    if (!user) throw new exception.NotFoundError(`user id ${id}`);

    const { file } = ctx.req;

    await user.update({
      avatar: `${config.baseUrl}/images/${file.filename}`
    });

    ctx.body = { msg: '上传成功', user: { user } };
  }
}
