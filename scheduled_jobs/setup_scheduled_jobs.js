
const cron = require('node-cron');
const generate_resources = require('./generate_resources');
module.exports = (client) => {

    cron.schedule('* * * * *', () => generate_resources(client));
}