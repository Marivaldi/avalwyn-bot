const faction_selection = require('../texts/faction_selection.json');
const Discord = require('discord.js');

module.exports = new Discord.MessageEmbed()
.setColor(faction_selection.color)
.setTitle(faction_selection.title)
.setDescription(faction_selection.description)
.addFields(
    { name: '\u200B', value: '\u200B' },
    { name: faction_selection.the_north_header, value: faction_selection.the_north_description },
    { name: '\u200B', value: faction_selection.the_north_command },
    { name: '\u200B', value: '\u200B' },
    { name: faction_selection.krackan_header, value: faction_selection.krackan_description },
    { name: '\u200B', value: faction_selection.krackan_command },
    { name: '\u200B', value: '\u200B' },
    { name: faction_selection.old_country_header, value: faction_selection.old_country_description },
    { name: '\u200B', value: faction_selection.old_country_command },
)
.setTimestamp()