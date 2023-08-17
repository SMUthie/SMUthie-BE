const jwt = require('jsonwebtoken');
const { errResponse } = require('../config/response');

module.exports = {
  signAToken: (user_idx) => {
    const payload = {
      user_idx: user_idx,
    };
    return jwt.sign(payload, process.env.JWTSECRET, {
      algorithm: process.env.JWT_SIGN_ALGORITHM,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRESIN,
    });
  },

  signRToken: () => {
    const NEW_R_TOKEN = jwt.sign({}, process.env.JWTSECRET, {
      algorithm: process.env.JWT_SIGN_ALGORITHM,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRESIN,
    });
    return NEW_R_TOKEN;
  },

  verifyRToken: async (rToken) => {
    try {
      jwt.verify(rToken, process.env.JWTSECRET);
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        //유효 기간 초과
        logger.info(`Refresh Token Verify Error - Time Out: \n ${error}`);
        return false;
      } else {
        //잘못된 토큰
        logger.info(`Refresh Token Verify Error - Wrong JWT: \n ${error}`);
        return false;
      }
    }
  },
};
