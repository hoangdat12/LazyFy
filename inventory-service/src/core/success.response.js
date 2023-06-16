import HttpStatusCode from '../utils/httpStatusCode/index.js';

class SuccessResponse {
  constructor(
    message = HttpStatusCode.ReasonPhrases.OK,
    metadata = {},
    statusCode = HttpStatusCode.StatusCodes.OK
  ) {
    this.message = message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  send(res, header = {}) {
    return res.status(this.statusCode).json(this);
  }
}

class OK extends SuccessResponse {
  constructor(
    metadata = {},
    message = HttpStatusCode.ReasonPhrases.OK,
    options = {}
  ) {
    super(message, metadata);
    this.options = options;
  }
}

class CREATED extends SuccessResponse {
  constructor(
    metadata = {},
    message = HttpStatusCode.ReasonPhrases.CREATED,
    options = {}
  ) {
    super(message, metadata, 201);
    this.options = options;
  }
}

export { OK, CREATED };
