const Discord = require('discord.js');
const send_message_to_active_channel = require('../helpers/send_message_to_active_channel');
const valid_resources = require('../factions/valid_resources.json');
const valid_factions = require('../factions/valid_factions.json');
const pickRandom = require('pick-random');
const random = require('random');
const resource_generation = require('../texts/resource_generation.json');
const to_faction_name = require('../texts/to_faction_name');
const to_resource_name = require('../texts/to_resource_name');
const FactionState = require('../FactionState');

module.exports = async (faction_store, client) => {
    const embed = new Discord.MessageEmbed()
        .setColor(resource_generation.color)
        .setTitle(resource_generation.title)
        .setDescription(resource_generation.description);

    const d = new Date();
    console.log("Generating Resources...", d.toLocaleString('en-US', {
        timeZone: 'America/New_York'
    }));

    const pending_spells = await get_spells();

    valid_factions.forEach((faction_key) => {
        const faction_state = new FactionState(faction_key);
        if (faction_state.isBattling()) {
            embed.addFields({
                name: to_faction_name(faction_key),
                value: `Was busy on the battlefield.`
            }, )
        } else {
            const resource_key = pickRandom(valid_resources, {
                count: 1
            });
            let amount = random.int(2, 15);
            const faction = faction_store.get(faction_key);
            const has_dimir = faction.diplomats.some((diplomat) => diplomat === "dimir");
            const has_courage = faction.diplomats.some((diplomat) => diplomat === "courage");
            const has_mercedes = faction.diplomats.some((diplomat) => diplomat === "mercedes");
            amount = (has_mercedes && resource_key === "gold") ? amount * 2 : amount;
            const mercedes_text = (has_mercedes) ? `\nMercedes: *"I call that a glow up."*`: "";
            const courage_increase = (has_courage) ? 5 : 0;
            const courage_text = (has_courage) ? `\nCourage: *"I found 5 ${to_resource_name(faction_key, "ore")} over there."*`: "";
            const dimir_increase = (has_dimir) ? random.int(2, 15) : 0;
            const dimir_text = (has_dimir) ? `\nDimir's Golden Brew brings in ${dimir_increase} new ${to_resource_name(faction_key, "citizens")}`: "";

            const faction_is_target_of_spell = (faction_key in pending_spells);
            const faction_is_target_of_lesser_harvest = faction_is_target_of_spell && pending_spells[faction_key] === "lesser_harvest";
            const lesser_harvest_text = (faction_is_target_of_lesser_harvest) ? `\n*Lesser Harvest -> Gained an additional +5 ${to_resource_name(faction_key, "food")}*` : "";
            const lesser_harvest_bonus = (faction_is_target_of_lesser_harvest) ? 5 : 0;


            if (faction) {
                faction.resources[resource_key] += amount;
                faction.resources.citizens += dimir_increase;
                faction.resources.ore += courage_increase;
                faction.resources.food += lesser_harvest_bonus;
                faction_store.put(faction_key, faction);
                embed.addFields({
                    name: to_faction_name(faction_key),
                    value: `Gained ${amount} ${to_resource_name(faction_key, resource_key)}.${dimir_text}${mercedes_text}${courage_text}${lesser_harvest_text}`
                }, )
            }
        }

    });

    embed.setTimestamp();

    send_message_to_active_channel(embed, client);
    return new Promise((resolve, reject) => {
        resolve('ok')
    });
}

async function get_spells() {
    let pending_spells = {};
    for(let i = 0; i < valid_factions.length; i ++) {
        const faction_key = valid_factions[i];
        const faction_state = new FactionState(faction_key);
        if(!faction_state.isCasting()) continue;

        pending_spells[faction_state.castingAgainstWho()] = faction_state.castingWhichSpell();
    }

    return new Promise((resolve, reject) => {
        resolve(pending_spells)
    });
}