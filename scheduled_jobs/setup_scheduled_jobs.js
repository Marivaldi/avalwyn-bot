
const cron = require('node-cron');
const Storage = require('node-storage');
const generate_resources = require('./generate_resources');
const train_skills = require('./train_skills');
const decide_battles = require('./decide_battles');

module.exports = (client) => {
    cron.schedule("0 * * * * *", async () =>  {
        const faction_store = new Storage('./data/faction_data');
        await generate_resources(faction_store, client);
        await decide_battles(faction_store, client);
    });

    cron.schedule("15 * * * * *", async () =>  {
        const faction_store = new Storage('./data/faction_data');
        await train_skills(faction_store, client);
    })
}