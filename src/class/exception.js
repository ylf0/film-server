class AuthError extends Error {
  /**
   * Constructor
   */
  constructor() {
    super('无操作权限');
    this.status = 401;
  }
}

class ForbiddenError extends Error {
  /**
   * Constructor
   * @param { string } detail the detail of the forbidden reason.
   */
  constructor(detail = 'some unknown reason') {
    super(detail);
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

export default { AuthError, ForbiddenError, NotFoundError };
