const cron = require('node-cron');
const generate_resources = require('./generate_resources');
const train_skills = require('./train_skills');
const decide_battles = require('./decide_battles');
const AvalwynStorage = require("../AvalwynStorage");
const random_diplomat = require('./random_diplomat');

module.exports = (client) => {
    const resource_interval = process.env.RESOURCE_GENERATION_INTERVAL;
    const resource_interval_is_not_a_number = isNaN(resource_interval);
    if (resource_interval_is_not_a_number) {
        console.log(`Resource Interval: ${resource_interval} is not valid!`);
        return [];
    }
    const resource_generation_schedule = `0 */${resource_interval} * * * *`;

    const training_interval = resource_interval * 7;
    const training_schedule = `5 */${training_interval} * * * *`;

    const new_diplomat_schedule = process.env.NEW_DIPLOMAT_SCHEDULE;

    const resource_generation_schedule_is_valid = cron.validate(resource_generation_schedule);
    const training_schedule_is_valid = cron.validate(training_schedule);
    const new_diplomat_schedule_is_valid = cron.validate(new_diplomat_schedule);

    if (!resource_generation_schedule_is_valid || !training_schedule_is_valid || !new_diplomat_schedule_is_valid) {
        console.error("Cron Validation Error!");
        console.log("Resource Generation Schedule: ", resource_generation_schedule);
        console.log("Training Schedule: ", training_schedule);
        console.log("New Diplomat Schedule: ", new_diplomat_schedule);
        return [];
    }

    const resource_and_battle_job = cron.schedule(resource_generation_schedule, async () => {
        const faction_store = new AvalwynStorage().faction_storage;
        await generate_resources(faction_store, client);
        await decide_battles(faction_store, client);
    }, {
        scheduled: true,
        timezone: "America/New_York"
    });

    const skill_training_job = cron.schedule(training_schedule, async () => {
        const faction_store = new AvalwynStorage().faction_storage;
        await train_skills(faction_store, client);
    }, {
        scheduled: true,
        timezone: "America/New_York"
    });

    const new_diplomat_job = cron.schedule(new_diplomat_schedule, async () => {
        await random_diplomat(client);
    }, {
        scheduled: true,
        timezone: "America/New_York"
    });

    return [resource_and_battle_job, skill_training_job, new_diplomat_job];
}