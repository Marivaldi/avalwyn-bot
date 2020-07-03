const faction_selection = require('../texts/faction_selection.json');
const Discord = require('discord.js');
const valid_factions = require('../factions/valid_factions.json');
const faction_text = require('../texts/faction_text.json');

const embed = new Discord.MessageEmbed()
.setColor(faction_selection.color)
.setTitle(faction_selection.title)
.setDescription(faction_selection.description);

valid_factions.forEach((faction_key) => {
    embed.addFields(
        { name: '\u200B', value: '\u200B' },
        { name: faction_text[faction_key].name, value: faction_text[faction_key].description },
        { name: '\u200B', value: faction_text[faction_key].command  },
    )
})

embed.setTimestamp()

module.exports = embed;