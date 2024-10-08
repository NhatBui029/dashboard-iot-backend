const prisma = require('./db-client')
const createDataSensor = async (data) => {
    return await prisma.sensorData.create({
        data: data
    })
}

const deleteOldRecords = async () => {
    await prisma.$executeRaw `
                                DELETE FROM \`sensor_data\`
                                WHERE \`id\` NOT IN (
                                    SELECT \`id\` FROM (
                                        SELECT \`id\` FROM \`sensor_data\`
                                        ORDER BY \`createdAt\` DESC
                                        LIMIT 100
                                    ) AS subquery
                                );
                            `;
}

const findDataSensorByContidion = async (condition, pagination, order)=>{
    return await prisma.sensorData.findMany({
        where: condition,
        ...pagination,
        orderBy: order
    })
}

const countNumberDataSensorByCondition = async (condition) =>{
    return await prisma.sensorData.count({
        where: condition
    })
}

module.exports = {
    createDataSensor,
    deleteOldRecords,
    findDataSensorByContidion,
    countNumberDataSensorByCondition
}