class ForbiddenError extends Error {
  /**
   * Constructor
   * @param { string } detail the detail of the forbidden reason.
   */
  constructor(detail = 'some unknown reason') {
    super(`你的操作被拒绝了，因为${detail}`);
    this.status = 403;
  }
}

class NotFoundError extends Error {
  /**
   * Constructor
   * @param { string } resource this resource name.
   */
  constructor(resource = 'resource') {
    super(`'${resource}'不存在`);
    this.status = 404;
  }
}

export default { ForbiddenError, NotFoundError };
