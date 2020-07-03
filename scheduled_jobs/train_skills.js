const Discord = require('discord.js');
const valid_factions = require('../factions/valid_factions.json');
const random = require('random');
const to_faction_name = require('../texts/to_faction_name');

const send_message_to_faction_leaders = require('../helpers/send_message_to_faction_leaders');
const skill_training = require('../texts/skill_training.json');
const send_message_to_faction_leaders_with_store = require('../helpers/send_message_to_faction_leaders_with_store');
const can_train_skill = require('../helpers/can_train_skill');
const resource_requirement_text = require('../helpers/resource_requirement_text');
const get_resource_requirement = require('../helpers/get_resource_requirement');

module.exports = async (faction_store, client) => {
    const t = new Date();
    console.log("Training Skills...", t.toISOString());

    for (let i = 0; i < valid_factions.length; i++) {
        const faction_key = valid_factions[i];
        const faction = faction_store.get(faction_key);
        if (!faction) continue;
        if (!faction.currently_training) {
            send_message_to_faction_leaders_with_store("Your faction is not set to train any skills. Run the `!train` command", faction_store, faction_key, client);
            continue;
        }

        const skill_key = faction.currently_training;
        if (!can_train_skill(faction, skill_key)) {
            send_message_to_faction_leaders_with_store(`${to_faction_name(faction_key)} does not have at least ${resource_requirement_text(skill_key)}`, faction_store, faction_key, client);
            continue;
        }

        const skill_increase = random.int(1, 3);
        const resource_requirement = get_resource_requirement(skill_key);
        const resource_key_to_decrease = resource_requirement.resource;
        const resource_decrease = resource_requirement.amount;
        const increase_text = (skill_increase === 3) ? ":tada: Max Increase (+3) :tada:" : `Increased by ${skill_increase}.`
        const decrease_text = resource_requirement_text(faction_key, skill_key);

        faction.stats[skill_key] += skill_increase;
        faction.resources[resource_key_to_decrease] -= resource_decrease;

        faction_store.put(faction_key, faction);
        const embed = new Discord.MessageEmbed()
            .setColor(skill_training.color)
            .setTitle(`${skill_training.title} by ${to_faction_name(faction_key)}`)
            .setDescription(skill_training.description[skill_key][faction_key])
            .addFields({
                name: skill_key.toUpperCase(),
                value: `${increase_text}\n-${decrease_text}`
            })
            .setTimestamp();

        send_message_to_faction_leaders_with_store(embed, faction_store, faction_key, client);

    }

    return new Promise((resolve, reject) => {
        resolve('ok')
    });
}