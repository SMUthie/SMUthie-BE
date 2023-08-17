const jwt = require('jsonwebtoken');
const baseResponse = require('./baseResponseStatus');
const { errResponse } = require('./response');
const { logger } = require('./winston');

exports.verifyAToken = (req, res, next) => {
  // const token = req.headers['x-access-token'] || req.query.token;
  const token = req.headers['x-access-token'];
  if (!token) return res.send(errResponse(baseResponse.TOKEN_EMPTY));
  try {
    req.user_idx = jwt.verify(token, process.env.JWTSECRET).user_idx;
    if (!req.user_idx) {
      logger.info(`Access Token Verify Error - Wrong JWT: \n ${error}`);
      return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      //유효 기간 초과
      logger.info(`Access Token Verify Error - Time Out: \n ${error}`);
      return res.send(errResponse(baseResponse.TOKEN_EXPIRED_FAILURE));
    } else {
      //잘못된 토큰
      logger.info(`Access Token Verify Error - Wrong JWT: \n ${error}`);
      return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }
  }
};
