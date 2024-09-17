const express = require('express');
const { postDataSensor ,getDataSensors} = require('../controllers/dataSensor');

const route = express.Router();

route.get('/data', getDataSensors);

module.exports = route;