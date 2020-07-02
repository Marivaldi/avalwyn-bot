const PlayerState = require("../PlayerState");
const faction_selection_embed = require("../embeds/faction_selection_embed");
const Storage = require('node-storage');


module.exports = (message) => {
    const bot_store = new Storage('./data/bot_data');
    if(!message) return;

    const player_state = new PlayerState(message.author.id);
    const isInProperState = player_state.stateMachine.can('sayYes');
    if(!isInProperState) {
        message.author.send("Invalid Command in your current context.");
        return;
    }

    player_state.sayYes();

    const current_state =  player_state.currentState();
    switch(current_state) {
        case "factionSelection":
            const players = bot_store.get("players") || [];
            if(!players.includes(message.author.id)) {
                players.push(message.author.id);
                bot_store.put("players", players);
            }

            bot_store.put(message.author.id, {});
            message.author.send(faction_selection_embed);
            break;
        default:
            break;
    }
}