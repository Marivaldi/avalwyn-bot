const Discord = require('discord.js');
const send_message_to_active_channel = require('../helpers/send_message_to_active_channel');
const pickRandom = require('pick-random');
const DiplomatState = require('../DiplomatState');
const diplomats = require('../factions/diplomats.json');

module.exports = async (client) => {
    const diplomat_keys = Object.keys(diplomats);

    console.log("Diplomat Keys:", diplomat_keys);

    const wandering_diplomat_keys = diplomat_keys.filter((diplomat_key) => {
        const diplomat_state = new DiplomatState(diplomat_key);
        console.log("Diplomat: ", diplomat_key);
        console.log("State:", diplomat_state.stateMachine.state);
        return diplomat_state.isWandering();
    });

    console.log("Wandering Diplomats:", wandering_diplomat_keys);

    if(!wandering_diplomat_keys || wandering_diplomat_keys.length === 0) {
        const d = new Date();
        console.log("We're out of Diplomats!", d.toLocaleString('en-US', {
            timeZone: 'America/New_York'
        }));
        return;
    }

    const diplomat_key = pickRandom(wandering_diplomat_keys, { count: 1 })[0];

    if(!(diplomat_key in diplomats)) return;

    const d = new Date();
    console.log("Sending Out Diplomat...", d.toLocaleString('en-US', {
        timeZone: 'America/New_York'
    }));

    const diplomat = diplomats[diplomat_key];

    const diplomat_state = new DiplomatState(diplomat_key);

    const diplomat_dialogue = pickRandom(diplomat.dialogue, { count: 1 })[0];

    const embed = new Discord.MessageEmbed()
        .setColor(diplomat.embed_color)
        .setTitle(`A wild ${diplomat.name} appeared`)
        .setDescription(`> *${diplomat_dialogue}*\n`)
        .addFields({
            name: "Effect",
            value: `${diplomat.effect}`
        },
        {
            name: "Hire",
            value: `Run \`!hire ${diplomat_key}\` to equip this Diplomat.`
        })
        .setThumbnail(diplomat.thumbnail)
        .setTimestamp();

    diplomat_state.appear();

    send_message_to_active_channel(embed, client);

    return new Promise((resolve, reject) => {
        resolve('ok')
    });
}