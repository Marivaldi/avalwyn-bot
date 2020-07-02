
const cron = require('node-cron');
const Storage = require('node-storage');
const generate_resources = require('./generate_resources');
const train_skills = require('./train_skills');

module.exports = (client) => {
    cron.schedule("0 * * * *", async () =>  {
        const t = new Date();
        console.log("Generating Resources...", t.toISOString());
        const faction_store = new Storage('./data/faction_data');
        await generate_resources(faction_store, client);
    });

    cron.schedule("1 */3 * * *", async () =>  {
        const t = new Date();
        console.log("Training Skills...", t.toISOString());
        const faction_store = new Storage('./data/faction_data');
        await train_skills(faction_store, client);
    })
}