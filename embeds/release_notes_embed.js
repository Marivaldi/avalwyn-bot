const faction_selection = require('../texts/faction_selection.json');
const Discord = require('discord.js');
const release_notes_version = (process.env.HEROKU_RELEASE_VERSION) ? `(${process.env.HEROKU_RELEASE_VERSION})` : "";
const embed = new Discord.MessageEmbed()
    .setColor(faction_selection.color)
    .setTitle(`Release Notes ${release_notes_version}`)
    .setDescription("*Where is my* :brain:*?*");


embed.addFields({
    name: ":mage: New Spells :mage:",
    value: 'Run `a!spells` to check out the new spells.'
})


embed.setTimestamp()

module.exports = embed;