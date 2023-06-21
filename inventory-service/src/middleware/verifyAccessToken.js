import { ForbiddenRequestError } from '../core/error.response.js';
import { ClientGRPCForUser } from '../gRPC/client.gRPC.js';
import { asyncHandler } from '../helpers/asyncHandler.js';

const clientGrpcForAuth = new ClientGRPCForUser();

const verifyAccessToken = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.header('x-client-id');
    let accessTokenHeader = null;
    const authHeader = String(req.headers['authorization'] || '');
    if (authHeader.startsWith('Bearer ')) {
      accessTokenHeader = authHeader.substring(7, authHeader.length);
    }
    const accessToken =
      req.header('authorization') ||
      req.header('Authorization') ||
      accessTokenHeader;

    const { isValid, message, user } =
      await clientGrpcForAuth.verifyAccessToken({
        accessToken,
        userId,
      });

    if (!isValid) throw new ForbiddenRequestError(message);
    console.log(next);
    req.user = user;
    return next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export default verifyAccessToken;
