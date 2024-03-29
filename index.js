const express = require('./config/express');
const { logger } = require('./config/winston');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') }); //env설정

const port = process.env.PORT || 3000;
express().listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);
