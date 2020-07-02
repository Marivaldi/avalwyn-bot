const PlayerState = require("../PlayerState");
const Storage = require('node-storage');
// const send_message_to_faction_leaders = require('../helpers/send_message_to_faction_leaders');
const valid_skills = require('../factions/valid_skills.json');
const valid_factions = require("../factions/valid_factions.json");
const send_message_to_active_channel = require("../helpers/send_message_to_active_channel");
const to_faction_name = require("../texts/to_faction_name");

module.exports = (message, client, enemy) => {
    const bot_store = new Storage('./data/bot_data');
    const faction_store = new Storage('./data/faction_data');
    if(!message) return;

    const player = bot_store.get(message.author.id);

    if(!player) {
        message.channel.send("You haven't even started a game yet. Run the `!start` command.");
        return;
    }

    if(!player.faction) {
        message.author.send("Looks like you're not currently a part of any factions. Run `!join` followed by one of these faction names: `" + valid_factions.join(' ') +"`");
        return;
    }

    const not_a_valid_faction = !valid_factions.includes(enemy);
    if(not_a_valid_faction) {
        const factions_not_including_own = valid_factions.filter((faction) => faction !== player.faction);
        message.author.send("`" + enemy + "` is not a valid faction. Run `!battle` followed by one of these: `" + factions_not_including_own.join(', ') + "`");
        return;
    }

    const player_is_trying_to_fight_self = player.faction === enemy;
    if(player_is_trying_to_fight_self) {
        message.author.send("As much as we'd all like to see it. You can't fight yourself...  Run `!battle` followed by one of these: `" + factions_not_including_own.join(', ') + "`");
        return;
    }

    const player_state = new PlayerState(message.author.id);
    const isInProperState = player_state.currentState() === "generalPlay";
    if(!isInProperState) {
        message.author.send("Something happened. Probably bad code. Let Shayne know this happened.");
        return;
    }

    send_message_to_active_channel(`A skirmish has broken out between two factions: ${to_faction_name(player.faction)} has launched an assault on ${to_faction_name(enemy)}`, client);
}