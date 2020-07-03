const Storage = require('node-storage');
module.exports = class AvalwynStorage {

    static instance;

    constructor() {
        if (AvalwynStorage.instance) {
            return AvalwynStorage.instance;
        }

        this.bot_storage = new Storage('./data/bot_data');
        this.state_storage = new Storage('./data/state_data');
        this.active_channel_storage = new Storage('./data/active_channel_data');
        this.faction_storage = new Storage('./data/faction_data');
        AvalwynStorage.instance = this;
    }

}