const initial_factions = require("../factions/initial_factions.json");
const AvalwynStorage = require("../AvalwynStorage");

module.exports = () => {
    const faction_store = new AvalwynStorage().faction_storage;
    faction_keys = Object.keys(initial_factions);
    for(let i = 0; i < faction_keys.length; i++) {
        const faction_key = faction_keys[i];
        const existing_faction = faction_store.get(faction_key);
        if(existing_faction) continue;

        faction_store.put(faction_key, initial_factions[faction_key]);
    }
}