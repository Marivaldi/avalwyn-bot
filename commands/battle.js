const PlayerState = require("../PlayerState");
const FactionState = require("../FactionState");
const valid_factions = require("../factions/valid_factions.json");
const to_faction_name = require("../texts/to_faction_name");
const send_attachment_to_active_channel = require('../helpers/send_attachment_to_active_channel');
const generate_battle_attachment = require('../helpers/generate_battle_attachment');
const to_resource_name = require("../texts/to_resource_name");
const generate_cancelled_battle_attachment = require("../helpers/generate_cancelled_battle_attachment");
const AvalwynStorage = require("../AvalwynStorage");
const special_arguments = ["cancel"]

module.exports = async (message, client, argument) => {
    if(!message) return;

    const bot_store = new AvalwynStorage().bot_storage;

    const player = bot_store.get(message.author.id);

    if(!player) {
        message.channel.send("You haven't even started a game yet. Run the `!start` command.");
        return;
    }

    if(!player.faction) {
        message.author.send("Looks like you're not currently a part of any factions. Run `!join` followed by one of these faction names: `" + valid_factions.join(' ') +"`");
        return;
    }

    const faction_state = new FactionState(player.faction);
    const argument_is_special_case = special_arguments.includes(argument);
    if(argument_is_special_case) {
        switch(argument) {
            case "cancel":
                cancel_battle(message, faction_state, player, client);
                break;
            default:
                break;
        }

        return;
    }

    const enemy = argument;

    const not_a_valid_faction = !valid_factions.includes(enemy);
    if(not_a_valid_faction) {
        const factions_not_including_own = valid_factions.filter((faction) => faction !== player.faction);
        message.author.send("`" + enemy + "` is not a valid faction. Run `!battle` followed by one of these: `" + factions_not_including_own.join(', ') + "`");
        return;
    }

    const player_is_trying_to_fight_self = player.faction === enemy;
    if(player_is_trying_to_fight_self) {
        const factions_not_including_own = valid_factions.filter((faction) => faction !== player.faction);
        message.author.send("As much as we'd all like to see it, you can't fight yourself...  Run `!battle` followed by one of these: `" + factions_not_including_own.join(', ') + "`");
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
        message.author.send("You already have a battle pending with "+ to_faction_name(existing_enemy) + ". Run `!battle cancel` if you'd like to withdraw your troops from the battlefield.");
        return;
    }

    const factionIsAlreadyCasting = faction_state.isCasting();
    if(factionIsAlreadyCasting) {
        const existing_enemy = faction_state.castingAgainstWho();
        const pending_spell = faction_state.castingWhichSpell();
        message.author.send("You are already casting " + pending_spell + " on "+ to_faction_name(existing_enemy) + ". You can't cast and battle on the same day.\nRun `!cast cancel` if you'd like to cancel the pending spell, and try casting a new one.");
        return;
    }

    const citizens_required_for_battle = 5;
    const faction_store = new AvalwynStorage().faction_storage;
    const faction = faction_store.get(player.faction);
    const actual_number_of_citizens = faction.resources.citizens;
    if (citizens_required_for_battle > actual_number_of_citizens) {
        message.author.send(`You need at least ${citizens_required_for_battle} ${to_resource_name(player.faction, "citizens")} to launch an attack.\nBide your time and stay on the defensive.`);
        return;
    }


    faction_state.battle(enemy);

    const battle_message = `${to_resource_name(player.faction, "citizens")} have been mobilized: ${to_faction_name(player.faction)} has launched an assault on ${to_faction_name(enemy)} \nAt the end of the day, when resources are tallied. We will see who comes out on top.`;
    const attachment = await generate_battle_attachment(player.faction, enemy);
    send_attachment_to_active_channel(battle_message, attachment, client);
}

async function cancel_battle(message, faction_state, player, client) {
    if(!faction_state.isBattling()) {
        message.author.send("The troops are already at home...");
        return;
    }
    const enemy = faction_state.battlingWho();
    const battle_message = `${to_resource_name(player.faction, "citizens")} are leaving the battlefield: ${to_faction_name(player.faction)} has cancelled their assault on ${to_faction_name(enemy)}.`;
    const attachment = await generate_cancelled_battle_attachment(player.faction, enemy);
    send_attachment_to_active_channel(battle_message, attachment, client);

    faction_state.cancelBattle();
    message.author.send("We're bringing the troops home...");
}