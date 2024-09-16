const data = require('./dataSensor')
function route(app) {
    app.use('/data', data);
    app.use('/', (req, res) => {
        res.send('Hello World!');
    })
}
module.exports = route;