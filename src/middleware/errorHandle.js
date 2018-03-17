export default () => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.status || 400;
    ctx.body = { msg: error.message };
    console.error(error.stack);
  }
};
