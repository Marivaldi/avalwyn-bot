
const cron = require('node-cron');
const Storage = require('node-storage');
const generate_resources = require('./generate_resources');
const train_skills = require('./train_skills');

module.exports = (client) => {
    const every_nineteenth_minute = "0/19 * * * *";
    const every_hour = "0 */1 * * *";
    cron.schedule("* * * * *", async () =>  {
        const faction_store = new Storage('./data/faction_data');
        await generate_resources(faction_store, client);
        train_skills(faction_store, client);
    });
}