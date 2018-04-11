import User from 'models/user';
import exception from 'class/exception';
import pathCheck from 'utils/pathCheck';

/**
 * 用户认证中间件
 */

export default (option = {}) => async (ctx, next) => {
  if (!pathCheck(ctx.path, option)) {
    await next();
    return;
  }
  const token = ctx.headers.Authorization || ctx.headers.authorization;
  if (!token) throw new exception.AuthError();

  const user = await User.findOne({ where: { token } });
  if (!user) throw new exception.AuthError();

  ctx.user = user;
  await next();
};
