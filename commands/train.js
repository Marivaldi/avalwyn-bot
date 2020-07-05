const PlayerState = require("../PlayerState");
const AvalwynStorage = require("../AvalwynStorage");
const send_message_to_faction_leaders = require('../helpers/send_message_to_faction_leaders');
const valid_skills = require('../factions/valid_skills.json');

module.exports = (message, client, skill) => {
    const bot_store = new AvalwynStorage().bot_storage
    const faction_store = new AvalwynStorage().faction_storage;
    if(!message) return;

    const player = bot_store.get(message.author.id);

    if(!player) {
        message.channel.send("You haven't even started a game yet. Run the `!start` command.");
        return;
    }

    if(!player.faction) {
        message.author.send("Looks like you're not currently a part of any factions. Join one and then you can run the `!train` command.");
        return;
    }

    const not_a_valid_skill = !valid_skills.includes(skill);
    if(not_a_valid_skill) {
        message.author.send("`" + skill + "` is not a valid skill to train. Use one of these: `" + valid_skills.join(', ') + "`");
        return;
    }

    const player_state = new PlayerState(message.author.id);
    const isInProperState = player_state.currentState() === "generalPlay";
    if(!isInProperState) {
        message.author.send("Something happened. Probably bad code. Let <@390639479599136784> know this happened.");
        return;
    }

    faction_store.put(`${player.faction}.currently_training`, skill);
    send_message_to_faction_leaders(`Your homie ${message.author} thought it would be a good idea for the faction to train **${skill}**. Hope you agree! If not, maybe hold a meeting of faction leaders, and decide what to train.`, player.faction, client);
}