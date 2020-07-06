const faction_selection = require('../texts/faction_selection.json');
const Discord = require('discord.js');
const release_notes_version = (process.env.HEROKU_RELEASE_VERSION) ? `(${process.env.HEROKU_RELEASE_VERSION})` : "";
const embed = new Discord.MessageEmbed()
    .setColor(faction_selection.color)
    .setTitle(`Release Notes ${release_notes_version}`)
    .setDescription("*Where is my* :brain:*?*");


embed.addFields({
    name: "Fixed Fortify Spell Command",
    value: 'I\'m a dingus. Fortify will now say `a!cast fortify [faction]`'
})


embed.setTimestamp()

module.exports = embed;