const PlayerState = require("../PlayerState");
const to_faction_name = require("../texts/to_faction_name");
const valid_factions = require("../factions/valid_factions.json");

const Storage = require('node-storage');
const send_message_to_active_channel = require('../helpers/send_message_to_active_channel');
const add_leader_to_faction = require('../helpers/add_leader_to_faction');


module.exports = (message, choice, client) => {
    const bot_store = new Storage('./data/bot_data');
    if(!message) return;

    const player_state = new PlayerState(message.author.id);
    const isInProperState = player_state.stateMachine.can('chooseFaction');
    if(!isInProperState) {
        message.author.send("Invalid Command in your current context.");
        return;
    }

    const is_valid_faction = valid_factions.includes(choice);
    if(!is_valid_faction) {
        message.author.send(`You have chosen an invalid faction.`);
        return;
    }

    player_state.chooseFaction();

    bot_store.put(`${message.author.id}.faction`, choice);

    add_leader_to_faction(choice, message.author);

    const faction_name = to_faction_name(choice);
    message.author.send(`You have chosen ${faction_name}. Good luck!`)
    send_message_to_active_channel(`${faction_name} has a new member. Welcome, ${message.author}!`, client);
}