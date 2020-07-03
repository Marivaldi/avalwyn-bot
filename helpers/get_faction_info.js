const Discord = require('discord.js');
const faction_text = require('../texts/faction_text.json');
const to_resource_name = require('../texts/to_resource_name');
const faction_images = require('../factions/faction_images.json');
const pickRandom = require('pick-random');
const AvalwynStorage = require('../AvalwynStorage');


module.exports = (faction_key) => {
    if(!faction_key) return "You haven't joined a faction yet.";

    const faction_store = new AvalwynStorage().faction_storage;
    const faction = faction_store.get(faction_key);
    const is_valid_faction = (faction_key in faction_text);
    if(!faction || !is_valid_faction) return "Somehow your faction isn't valid... tell Shayne.";

    const my_faction_text = faction_text[faction_key];

    const my_faction_images = faction_images[faction_key];
    const faction_image = pickRandom(my_faction_images, {count: 1});

    const embed = new Discord.MessageEmbed()
        .setColor("#36454f")
        .setTitle(my_faction_text.name)
        .setDescription(my_faction_text.description)
        .setThumbnail(faction_image[0]);

    const stat_keys = Object.keys(faction.stats);

    for(let i = 0 ; i < stat_keys.length; i++) {
        const stat_key = stat_keys[i];
        embed.addFields({
            name: stat_key.toUpperCase(),
            value: faction.stats[stat_key],
            inline: true
        })
    }

    const resource_keys = Object.keys(faction.resources);

    for(let i = 0 ; i < resource_keys.length; i++) {
        const resource_key = resource_keys[i];
        embed.addFields({
            name: to_resource_name(faction_key, resource_key),
            value: faction.resources[resource_key],
            inline: true
        })
    }


    embed.setTimestamp()

    return embed;
}