const Discord = require('discord.js');
const valid_factions = require('../factions/valid_factions.json');
const training_requirements = require('../factions/training_requirements.json')

const embed = new Discord.MessageEmbed()
    .setColor("#90EE90")
    .setTitle("How to Play")
    .setDescription("*Avalwyn is a team-based Discord strategy game that takes place in the shared universe of our Dungeon's & Dragon's campaigns. At the start you each choose a faction. You share leadership of the faction with others who choose the same one as you. Every decision you make will effect your faction as a whole, so be sure to check in with your fellow faction leaders before you launch battles, or decide on a skill to train. Remember, Teamwork Makes the Dream Work!*\n\n")
    .addField(
        "Commands",
        `Commands should all start with \`${process.env.PREFIX}\`, but that's subject to change over time, if another bot's prefix clashes with AvalwynBot's.\n\n`
    )
    .addField(
        "Getting Started",
        `It's pretty simple. Type \`${process.env.PREFIX}start\` into any chat on a server that has AvalwynBot, and the prompts will guide you in Private Messages.\n\n`
    )
    .addField(
        "Factions",
        `So far there are ${valid_factions.length} factions to choose from. You'll be given a brief description, and prompted to choose one after you start.\n\nRemember that you may not be the only leader in this faction, so it's a good idea to check in with the other leaders before you take action.\n\n`
    )
    .addField(
        "Days in Avalwyn",
        `A day in Avalwyn is currently set to ${process.env.RESOURCE_GENERATION_INTERVAL} minutes in the real world. This is also, subject to change as <@390639479599136784> figures out how to balance the game.\n\nAt the end of each day Resources are generated and any pending battles are fought. At the end of a week (every ${process.env.RESOURCE_GENERATION_INTERVAL * 7} minutes) in Avalwyn your faction finishes training the skill they selected to train.\n\n`
    )
    .addField(
        "Training Skills",
        `Once you've joined a faction, you can decide what skill to train. Skills are dead simple in Avalwyn.\n\n-MIGHT is used when you are the agressor in a battle. Training MIGHT costs ${training_requirements.might.amount} food. \`${process.env.PREFIX}train might\`\n\n-FORTITUDE is used when you are the defender in a battle. Training FORTITUDE costs ${training_requirements.fortitude.amount} ore. \`${process.env.PREFIX}train fortitude\`\n\n-MAGIC is slow to progress, but gives you access to spells that can be used to alter battles or resource production. Training MAGIC costs ${training_requirements.magic.amount} gold. \`${process.env.PREFIX}train magic\`\n\n`
    )
    .addField(
        "Battling Rival Factions",
        `Battling is a quick way to get gold that you can use to train MAGIC, and maybe later do other stuff.\n\nTo initiate a battle, type \`${process.env.PREFIX}battle [faction_key]\` replacing faction_key with the key of a rival faction. At the end of an Avalwyn Day, the battle will be decided. A d20 is rolled for both the attacker and defender. The attacker's MIGHT is added to their roll, and the defender's FORTITUDE is added to *their* roll. Some spells may also effect the outcome of the battle.\n\n`
    )
    .addField(
        "Casting Spells",
        `Once you have at least a 1 in MAGIC, you can cast your first spell. Note that you cannot cast a spell and attack on the same Avalwyn Day.\n\nTo cast a spell type \`${process.env.PREFIX}cast [spell_key] [faction_key]\`. This will set that spell to be cast by the end of the day.\n\nFor a list of available spells, type \`${process.env.PREFIX}spells\``
    )
    .addField(
        "Diplomats",
        `Every Monday at 7:30, a familiar face will appear, ready to be hired by your faction. You will be prompted on how to hire them when they appear. Diplomats each have an effect attached to them that makes them valuable assets to the faction. In this current rules system, a faction can only have one Diplomat at a time.\n\n`
    )

embed.setTimestamp()

module.exports = embed;