
const cron = require('node-cron');
const generate_resources = require('./generate_resources');
const train_skills = require('./train_skills');
const decide_battles = require('./decide_battles');
const AvalwynStorage = require("../AvalwynStorage");
const random_diplomat = require('./random_diplomat');

module.exports = (client) => {
    const hourly = cron.schedule("0 0 * * * *", async () =>  {
        const faction_store = new AvalwynStorage().faction_storage;
        await generate_resources(faction_store, client);
        await decide_battles(faction_store, client);
    });

    const every_three_hours = cron.schedule("0 1 */3 * * *", async () =>  {
        const faction_store = new AvalwynStorage().faction_storage;
        await train_skills(faction_store, client);
        await random_diplomat(client);
    });

    return [hourly, every_three_hours];
}