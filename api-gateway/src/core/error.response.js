import HttpStatusCode from "../ultils/httpStatusCode/index.js";

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = HttpStatusCode.ReasonPhrases.CONFLICT,
    status = HttpStatusCode.StatusCodes.CONFLICT
  ) {
    super(message, status);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = HttpStatusCode.ReasonPhrases.BAD_REQUEST,
    status = HttpStatusCode.StatusCodes.BAD_REQUEST
  ) {
    super(message, status);
  }
}

class ForbiddenRequestError extends ErrorResponse {
  constructor(
    message = HttpStatusCode.ReasonPhrases.FORBIDDEN,
    status = HttpStatusCode.StatusCodes.FORBIDDEN
  ) {
    super(message, status);
  }
}

class InternalServerError extends ErrorResponse {
  constructor(
    message = HttpStatusCode.ReasonPhrases.INTERNAL_SERVER_ERROR,
    status = HttpStatusCode.StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message, status);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(
    message = HttpStatusCode.ReasonPhrases.UNAUTHORIZED,
    status = HttpStatusCode.StatusCodes.UNAUTHORIZED
  ) {
    super(message, status);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = HttpStatusCode.ReasonPhrases.NOT_FOUND,
    status = HttpStatusCode.StatusCodes.NOT_FOUND
  ) {
    super(message, status);
  }
}

export {
  ConflictRequestError,
  BadRequestError,
  ForbiddenRequestError,
  InternalServerError,
  AuthFailureError,
  NotFoundError,
};
