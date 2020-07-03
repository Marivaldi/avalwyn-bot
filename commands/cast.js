const PlayerState = require("../PlayerState");
const FactionState = require("../FactionState");
const Storage = require('node-storage');
const valid_factions = require("../factions/valid_factions.json");
const to_faction_name = require("../texts/to_faction_name");
const send_message_to_faction_leaders = require('../helpers/send_message_to_faction_leaders');
const all_spells = require('../factions/spells.json');
const special_arguments = ["cancel"]

module.exports = async (message, client, argument, target) => {
    if(!message) return;

    const bot_store = new Storage('./data/bot_data');
    const player = bot_store.get(message.author.id);

    if(!player) {
        message.channel.send("You haven't even started a game yet. Run the `!start` command.");
        return;
    }

    if(!player.faction) {
        message.author.send("Looks like you're not currently a part of any factions. Run `!join` followed by one of these faction names: `" + valid_factions.join(' ') +"`");
        return;
    }

    const spell = argument;
    const faction_state = new FactionState(player.faction);
    const argument_is_special_case = special_arguments.includes(argument);
    if(argument_is_special_case) {
        switch(argument) {
            case "cancel":
                cancel_spell(message, faction_state, player, client, spell);
                break;
            default:
                break;
        }
        return;
    }

    const enemy = target;

    if(!enemy) {
        message.author.send("You must specify the target of a spell. `!cast [spell] [target]`");
        return;
    }

    const not_a_valid_faction = !valid_factions.includes(enemy);
    if(not_a_valid_faction) {
        const factions_not_including_own = valid_factions.filter((faction) => faction !== player.faction);
        message.author.send("`" + enemy + "` is not a valid faction. Run `!cast` followed by one of these: `" + factions_not_including_own.join(', ') + "`");
        return;
    }

    const player_state = new PlayerState(message.author.id);
    const playerIsInProperState = player_state.currentState() === "generalPlay";
    if(!playerIsInProperState) {
        message.author.send("Something happened. Probably bad code. Let Shayne know this happened.");
        return;
    }

    const factionIsAlreadyBattling = faction_state.isBattling();
    if(factionIsAlreadyBattling) {
        const existing_enemy = faction_state.battlingWho();
        message.author.send("You already have a battle pending with "+ to_faction_name(existing_enemy) + ". You can't cast and battle on the same day.\nRun `!battle cancel` if you'd like to withdraw your troops from the battlefield. Then try casting the spell.");
        return;
    }

    const factionIsAlreadyCasting = faction_state.isCasting();
    if(factionIsAlreadyCasting) {
        const existing_enemy = faction_state.castingAgainstWho();
        const pending_spell = faction_state.castingWhichSpell();
        message.author.send("You are already casting " + all_spells[pending_spell].name + " on "+ to_faction_name(existing_enemy) + ". You can't cast and battle on the same day.\nRun `!cast cancel` if you'd like to cancel the pending spell, and try casting a new one.");
        return;
    }


    if(!(spell in all_spells)) {
        message.author.send("`" + spell + "` is not a valid spell. Ask Shayne to make it real.");
        return;
    }

    const player_is_trying_to_cast_on_self = player.faction === enemy;
    if(player_is_trying_to_cast_on_self && !all_spells[spell].can_cast_on_self) {
        message.author.send(`Unfortunately, ${all_spells[spell].name} cannot be cast on self. Run the \`!spells\` to get more information.`);
        return;
    }

    faction_state.castSpell(enemy, spell);

    const casting_message = `You've chosen to cast ${all_spells[spell].name} on ${to_faction_name(enemy)}`;
    send_message_to_faction_leaders(casting_message, player.faction, client)
}

function cancel_spell(message, faction_state, player, client, spell) {
    if(!faction_state.isCasting()) {
        message.author.send("You're not casting right now...");
        return;
    }

    const pending_spell = faction_state.castingWhichSpell();
    const spell_target = faction_state.castingAgainstWho();

    faction_state.cancelSpell();
    send_message_to_faction_leaders(`${message.author} has decide not to cast ${all_spells[pending_spell].name} on ${to_faction_name(spell_target)}. Take it up with them.`, player.faction, client)
}