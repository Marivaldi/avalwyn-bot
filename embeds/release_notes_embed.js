const faction_selection = require('../texts/faction_selection.json');
const Discord = require('discord.js');
const release_notes_version = (process.env.HEROKU_RELEASE_VERSION) ? `(${process.env.HEROKU_RELEASE_VERSION})` : "";
const embed = new Discord.MessageEmbed()
    .setColor(faction_selection.color)
    .setTitle(`Release Notes ${release_notes_version}`)
    .setDescription("*Make quick cash, and all you have to do is help sync the data. WOW!*");


embed.addFields({
    name: ":moneybag: Anyone Can Sync Data! :moneybag:",
    value: `I noticed that Alex wanted to sync the data to help out. The bot now allows non-admins to sync the data. You'll recieve +1 Gold anytime you sync the data. Please don't spam it though. It might break it... :grimacing:\n\`a!sync\``
})


embed.setTimestamp()

module.exports = embed;