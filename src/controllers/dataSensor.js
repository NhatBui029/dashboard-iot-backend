const dataSensorModel = require('../models/dataSensor');
const { PAGE_DEFAULT, PAGE_SIZE_DEFAULT , TIME_ZONE} = require('../constant');
const { fromZonedTime } = require('date-fns-tz');

async function postDataSensor(req, res) {
    try {
        const newDataSensor = await dataSensorModel.createDataSensor();
        res.status(200).json({
            message: 'Data successfully!',
            data: newDataSensor
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error !',
            error
        })
    }
}

async function getDataSensors(req, res) {
    try {
        let { content, searchBy, startTime, endTime, page, pageSize, sortBy, orderBy } = req.query;
        let condition = {};
        let order = {};

        page = Math.max(Number(page) || PAGE_DEFAULT, 1);
        pageSize = Math.max(Number(pageSize) || PAGE_SIZE_DEFAULT, 1);

        const pagination = {
            skip: (page - 1) * pageSize,
            take: pageSize,
        };

        content = Number(content);
        if (content && searchBy) {
            switch (searchBy) {
                case 'ID':
                    condition.id = content
                    break;
                case 'TEMPERATURE':
                    condition.temperature = content
                    break;
                case 'HUMIDITY':
                    condition.humidity = content
                    break;
                case 'LIGHT':
                    condition.light = content
                    break;
                case 'ALL':
                    condition.OR = [
                        {
                            id: content
                        }, {
                            temperature: content
                        }, {
                            humidity: content
                        }, {
                            light: content
                        }
                    ]
                    break;
                default:
                    res.status(400).json({
                        message: 'searchBy must be one of the following parameters [ALL,TEMPERATURE,HUMIDITY,LIGHT,ID]',
                    });
                    return;
            }
        }

        if (startTime && endTime) {
            condition.createdAt = {
                gte: fromZonedTime(startTime, TIME_ZONE),
                lte: fromZonedTime(endTime, TIME_ZONE)
            }
        }

        if (orderBy && orderBy !== 'ASC' && orderBy !== 'DESC') {
            res.status(400).json({
                message: 'orderBy must be one of the following parameters [ASC, DESC]',
            });
            return;
        }

        orderBy = orderBy?.toLowerCase() || 'asc'

        if (sortBy) {
            switch (sortBy) {
                case 'ID':
                    order.id = orderBy
                    break;
                case 'TEMPERATURE':
                    order.temperature = orderBy
                    break;
                case 'HUMIDITY':
                    order.humidity = orderBy
                    break;
                case 'LIGHT':
                    order.light = orderBy
                    break;
                case 'TIME':
                    order.createdAt = orderBy
                    break;
                default:
                    res.status(400).json({
                        message: 'sortBy must be one of the following parameters [TIME,TEMPERATURE,HUMIDITY,LIGHT,ID]',
                    })
                    break;
            }
        } else order.id = orderBy

        const [data, totalCount] = await Promise.all([
            await dataSensorModel.findDataSensorByContidion(condition, pagination, order),
            await dataSensorModel.countNumberDataSensorByCondition(condition)
        ]) 

        res.status(200).json({
            data,
            meta: {
                page,
                pageSize,
                totalCount
            }
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error !',
            error: error.message
        })
    }
}

module.exports = {
    postDataSensor,
    getDataSensors
}