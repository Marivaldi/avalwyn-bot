const faction_selection = require('../texts/faction_selection.json');
const Discord = require('discord.js');
const release_notes_version = (process.env.HEROKU_RELEASE_VERSION) ? `(${process.env.HEROKU_RELEASE_VERSION})` : "";
const embed = new Discord.MessageEmbed()
    .setColor(faction_selection.color)
    .setTitle(`Release Notes ${release_notes_version}`)
    .setDescription("*Wroted some nice code for the bot.*");


embed.addFields({
    name: "Aliased the Battle Command",
    value: 'Seems like a better name for the battle command is `a!attack [faction_key]`. The existing `a!battle [faction_key]` command still works though.'
}, {
    name: "Cancelling Battles",
    value: "Cancelling battles can now be done with any of the following commands:\n `a!battle cancel` `a!cancel_battle` `a!attack cancel` `a!cancel_attack`"
}, {
    name: "Cancelling Spells",
    value: "Cancelling spells can now be done with any of the following commands:\n `a!cast cancel` `a!cancel_spell`"
})


embed.setTimestamp()

module.exports = embed;