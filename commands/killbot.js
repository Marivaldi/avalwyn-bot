const Storage = require('node-storage');
const bot_store = new Storage('./data/bot_data');

module.exports = (client) => {
    // send channel a message that you're resetting bot [optional]
    const players = bot_store.get("players") || [];

    players.asyncForEach(async function (player) {
        console.log("sending");
        await client.users.cache.get(player).send("Bot shutting down for maintenance. BRB...");
    }).then(function (data) {
        console.log("destroying");
        destroy(client);
    });
}

function destroy (client) { client.destroy() }

Object.defineProperty(Array.prototype, "asyncForEach", {
    enumerable: false,
    value: function(task){
        return new Promise((resolve, reject) => {
            this.forEach(function(item, index, array){
                task(item, index, array);
                if(Object.is(array.length - 1, index)){
                    resolve({ status: 'finished', count: array.length })
                }
            });
        })
    }
});