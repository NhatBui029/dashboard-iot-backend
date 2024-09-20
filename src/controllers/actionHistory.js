const { PAGE_DEFAULT, PAGE_SIZE_DEFAULT , TIME_ZONE} = require('../constant');
const { fromZonedTime } = require('date-fns-tz');
const actionHistoryModel = require('../models/actionHistory');

async function getActionHistory(req, res) {
    try {
        let { searchBy, startTime, endTime, page, pageSize } = req.query;
        let condition = {};

        page = Math.max(Number(page) || PAGE_DEFAULT, 1);
        pageSize = Math.max(Number(pageSize) || PAGE_SIZE_DEFAULT, 1);

        const pagination = {
            skip: (page - 1) * pageSize,
            take: pageSize,
        };

         searchBy ||= 'ALL';
        if (['ALL','FAN','LED','AIR_CONDITIONER'].includes(searchBy)) {
            if(searchBy !== 'ALL') condition.device = searchBy
        } else {
            res.status(400).json({
                message: 'searchBy must be one of the following parameters [ALL,AIR_CONDITIONER, FAN, LED]',
            });
            return;
        }

        if (startTime && endTime) {
            condition.createdAt = {
                gte: fromZonedTime(startTime, TIME_ZONE),
                lte: fromZonedTime(endTime, TIME_ZONE)
            }
        }

        const [data, totalCount] = await Promise.all([
            await actionHistoryModel.findActionHistoryByContidion(condition, pagination),
            await actionHistoryModel.countNumberActionHistoryByCondition(condition)
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
    getActionHistory
}