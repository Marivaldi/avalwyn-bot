const PlayerState = require("../PlayerState");
const Storage = require('node-storage');
const valid_factions = require("../factions/valid_factions.json");
const to_faction_name = require("../texts/to_faction_name");
const send_attachment_to_active_channel = require('../helpers/send_attachment_to_active_channel');
const generate_battle_attachment = require('../helpers/generate_battle_attachment');

module.exports = async (message, client, enemy) => {
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

    const battle_message = `A skirmish has broken out between two factions: ${to_faction_name(player.faction)} has launched an assault on ${to_faction_name(enemy)}`;
    const attachment = await generate_battle_attachment(player.faction, enemy);
    send_attachment_to_active_channel(battle_message, attachment, client);
}