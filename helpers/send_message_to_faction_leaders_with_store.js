
module.exports = (message, faction_store, faction_key, client) => {
    const faction = faction_store.get(faction_key);
    if(!faction) return;

    faction.leaders.forEach(leader => {
        const user = client.users.cache.get(leader.id);
        user.send(message);
    }); 
}