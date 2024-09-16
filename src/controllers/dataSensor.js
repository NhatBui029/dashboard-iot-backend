const dataSensorModel = require('../models/dataSensor')
async function postDataSensor(req, res) {
    try {
        const newDataSensor = await dataSensorModel.createDataSensor();
        res.status(200).json({
            message: 'Data successfully!',
            data: newDataSensor
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error !'
        })
    }
}

module.exports = {
    postDataSensor
}