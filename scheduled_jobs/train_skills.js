const Discord = require('discord.js');
const valid_factions = require('../factions/valid_factions.json');
const random = require('random');
const to_faction_name = require('../texts/to_faction_name');

const send_message_to_faction_leaders = require('../helpers/send_message_to_faction_leaders');
const skill_training = require('../texts/skill_training.json');
const send_message_to_faction_leaders_with_store = require('../helpers/send_message_to_faction_leaders_with_store');

module.exports = async (faction_store, client) => {
    valid_factions.forEach((faction_key) => {
        const faction = faction_store.get(faction_key);
        if (faction) {
            if (!faction.currently_training) {
                send_message_to_faction_leaders_with_store("Your faction is not set to train any skills. Run the `!train` command", faction_store, faction_key, client);
            } else {
                const skill_key = faction.currently_training;
                const skill_increase = random.int(1, 3);
                const increase_text = (skill_increase === 3) ? ":tada: Max Increase (+3) :tada:" : `Increased by ${skill_increase}.`
                faction.stats[skill_key] += skill_increase;
                faction_store.put(faction_key, faction);
                const embed = new Discord.MessageEmbed()
                    .setColor(skill_training.color)
                    .setTitle(`${skill_training.title} by ${to_faction_name(faction_key)}`)
                    .setDescription(skill_training.description[skill_key][faction_key])
                    .addFields({
                        name: skill_key,
                        value: increase_text
                    })
                    .setTimestamp();

                send_message_to_faction_leaders_with_store(embed, faction_store, faction_key, client);
            }
        }
    });

    return new Promise((resolve, reject) => {
        resolve('ok')
    });
}