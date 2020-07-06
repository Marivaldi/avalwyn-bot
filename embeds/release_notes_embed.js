const faction_selection = require('../texts/faction_selection.json');
const Discord = require('discord.js');
const release_notes_version = (process.env.HEROKU_RELEASE_VERSION) ? `(${process.env.HEROKU_RELEASE_VERSION})` : "";
const embed = new Discord.MessageEmbed()
    .setColor(faction_selection.color)
    .setTitle(`Release Notes ${release_notes_version}`)
    .setDescription("*Sorry bout that... :grimacing:*");


embed.addFields({
    name: ":bug: Fixing Battle Notification Bug :bug:",
    value: 'Made a woopsie in the code. Please forgive me.'
})


embed.setTimestamp()

module.exports = embed;