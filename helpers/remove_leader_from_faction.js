const Storage = require('node-storage');

module.exports = (faction_key, user) => {
    const faction_store = new Storage('./data/faction_data');
    if(!faction_key || !user) return;

    const faction = faction_store.get(faction_key);
    if (!faction) return;

    console.log(faction.leaders);
    console.log(user.id);
    const leaders = faction.leaders.filter((leader) => leader.id !== user.id);
    console.log(leaders);

    faction_store.put(`${faction_key}.leaders`, leaders);
}