const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  OK: "Success!",
  CREATED: "Created!",
};

class SuccessResponse {
  constructor(
    message = ReasonStatusCode.OK,
    metadata = {},
    statusCode = StatusCode.OK
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
  constructor(message = ReasonStatusCode.OK, metadata = {}) {
    super(message, metadata);
  }
}

class CREATED extends SuccessResponse {
  constructor(message = ReasonStatusCode.CREATED, metadata = {}, options = {}) {
    super(message, metadata);
    this.options = options;
  }
}

export { OK, CREATED };
