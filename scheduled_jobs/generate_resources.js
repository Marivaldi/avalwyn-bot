const Discord = require('discord.js');
const send_message_to_active_channel = require('../helpers/send_message_to_active_channel');
const valid_resources = require('../factions/valid_resources.json');
const valid_factions = require('../factions/valid_factions.json');
const pickRandom = require('pick-random');
const random = require('random');
const resource_generation = require('../texts/resource_generation.json');
const to_faction_name = require('../texts/to_faction_name');
const to_resource_name = require('../texts/to_resource_name');
const Storage = require('node-storage');

module.exports = async (faction_store, client) => {
    const embed = new Discord.MessageEmbed()
            .setColor(resource_generation.color)
            .setTitle(resource_generation.title)
            .setDescription(resource_generation.description);

    valid_factions.forEach((faction_key) => {
        const resource_key = pickRandom(valid_resources, {count: 1});
        const amount = random.int(2, 15);
        const faction = faction_store.get(faction_key);
        if(faction) {
            faction.resources[resource_key] += amount;
            faction_store.put(faction_key, faction);
            embed.addFields(
                { name: to_faction_name(faction_key), value: `Gained ${amount} ${to_resource_name(faction_key, resource_key)}.` },
            )
        }
    });

    embed.setTimestamp();

    send_message_to_active_channel(embed, client);
    return new Promise((resolve, reject) => {
        resolve('ok')
    });

}