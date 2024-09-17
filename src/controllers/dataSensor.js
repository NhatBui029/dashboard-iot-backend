const dataSensorModel = require('../models/dataSensor');
const {PAGE_DEFAULT,PAGE_SIZE_DEFAULT} = require('../constant')
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

const mappingSearchBySensorData = {
    ALL: 'ALL',
    TEMPERATURE: 'temperature',
    HUMIDITY: 'humidity',
    LIGHT: 'light',
    ID: '',
}

async function getDataSensors(req, res) {
    try {
        const { content, searchBy, startTime, endTime, page, pageSize, sortBy, orderBy } = req.query;
        let condition = {};
        let order = {};

        const pageNumber = Math.max(Number(page) || PAGE_DEFAULT, 1); 
        const pageSizeNumber = Math.max(Number(pageSize) || PAGE_SIZE_DEFAULT, 1);

        const pagination = {
            skip: (pageNumber - 1) * pageSizeNumber,
            take: pageSizeNumber,
        };
        if (content && searchBy) {
            switch (searchBy) {
                case 'ID':
                    condition.id = Number(content)
                    break;
                case 'TEMPERATURE':
                    condition.temperature = Number(content)
                    break;
                case 'HUMIDITY':
                    condition.humidity = Number(content)
                    break;
                case 'LIGHT':
                    condition.light = Number(content)
                    break;
                case 'ALL':
                    condition.OR = [
                        {
                            id: Number(content)
                        }, {
                            temperature: Number(content)
                        }, {
                            humidity: Number(content)
                        }, {
                            light: Number(content)
                        }
                    ]
                    break;
                default:
                    res.status(400).json({
                        message: 'searchBy must be one of the following parameters [ALL,TEMPERATURE,HUMIDITY,LIGHT,ID]',
                    })
                    break;
            }
        } 

        if (startTime && endTime) {
            condition.createdAt = {
                gte: new Date(startTime),
                lte: new Date(endTime),
            }
        }

        if(sortBy) {
            switch (sortBy) {
                case 'ID':
                    condition.id = Number(content)
                    break;
                case 'TEMPERATURE':
                    condition.temperature = Number(content)
                    break;
                case 'HUMIDITY':
                    condition.humidity = Number(content)
                    break;
                case 'LIGHT':
                    condition.light = Number(content)
                    break;
            }
        } // xem FE truyền kiẻu gì



        const data = await dataSensorModel.findDataSensorByContidion(condition, pagination)

        res.status(200).json({
            message: 'Data successfully!',
            data
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error !',
            error
        })
    }
}

module.exports = {
    postDataSensor,
    getDataSensors
}