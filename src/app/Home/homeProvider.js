const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const homeDao = require("./homeDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveSchoolCafe = async function () { 
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const cafeListResult = await homeDao.selectSchoolCafe(connection);
    connection.release();

    return cafeListResult;  
  } catch (err) {
    logger.error(`[ERROR] ${err.message}`);   
    return errResponse(baseResponse.DB_ERROR); 
  }
}

exports.retrieveAndamiro = async function () { 
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const menuListResult = await homeDao.selectAndamiro(connection);
    connection.release();

    return menuListResult;  
  } catch (err) {
    logger.error(`[ERROR] ${err.message}`);   
    return errResponse(baseResponse.DB_ERROR); 
  }
}