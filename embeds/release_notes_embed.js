const faction_selection = require('../texts/faction_selection.json');
const Discord = require('discord.js');
const release_notes_version = (process.env.HEROKU_RELEASE_VERSION) ? `(${process.env.HEROKU_RELEASE_VERSION})` : "";
const embed = new Discord.MessageEmbed()
    .setColor(faction_selection.color)
    .setTitle(`Release Notes ${release_notes_version}`)
    .setDescription("*Muahahaha ahahaaaaa hahahahahahahHAHAHAHAHAA!!!!!1!!1!!!*");


embed.addFields({
    name: ":rofl: Added Evil Laugh Command :rofl:",
    value: 'Matt, this is for you.\n`a!evil_laugh`'
})


embed.setTimestamp()

module.exports = embed;