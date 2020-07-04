var StateMachine = require('javascript-state-machine');
const AvalwynStorage = require("./AvalwynStorage");

module.exports = class FactionState {
    stateMachine = null;
    state_store = new AvalwynStorage().state_storage;
    diplomat_key;

    constructor(diplomat_key) {
        this.diplomat_key = diplomat_key;
        this.stateForDiplomat();
    }

    isWandering() {
        return this.stateMachine.state === "wandering";
    }

    isReadyForHire() {
        return this.stateMachine.state === "readyForHire";
    }

    isAlreadyHired() {
        return this.stateMachine.state === "hired";
    }

    appear () {
        this.stateMachine.appear();
    }

    hire(faction_key) {
        if(!faction_key) return false;

        const faction_store = new AvalwynStorage().faction_storage;
        const faction = faction_store.get(faction_key);
        if(!faction) return false;

        const no_room_for_diplomat = faction.diplomats.length >= 1;
        if(no_room_for_diplomat) return false;

        faction.diplomats.push(this.diplomat_key);
        faction_store.put(faction_key, faction);
        this.state_store.put(this.diplomat_key + ".employer", faction_key);

        this.stateMachine.hire();
        return true;
    }

    employer() {
        return this.state_store.get(this.diplomat_key + ".employer");
    }

    fire() {
        const employer_faction_key = this.employer();
        const faction_store = new AvalwynStorage().faction_storage;
        const faction = faction_store.get(employer_faction_key);
        if(!faction) return false;

        const remaining_diplomats = faction.diplomats.filter((diplomat_key) => diplomat_key !== this.diplomat_key);
        faction.diplomats = remaining_diplomats;
        faction_store.put(employer_faction_key, faction);
        this.state_store.remove(this.diplomat_key + ".employer");
        this.stateMachine.fire();
        return true;
    }

    onAppear = () =>  {
        this.saveCurrentState();
    }

    onHire = () =>  {
        this.saveCurrentState();
    }

    onFire = () => {
        this.saveCurrentState();
    }


    saveCurrentState = () =>  {
        this.state_store.put(this.diplomat_key + ".lastState", this.stateMachine.state);
    }

    stateForDiplomat = () => {
        let lastState = this.state_store.get(this.diplomat_key + ".lastState");
        if(!lastState) {
            lastState = "wandering";
        }

        this.stateMachine = new StateMachine({
            init: "wandering",
            transitions: [
              { name: 'appear', from: 'wandering',  to: 'readyForHire' },
              { name: 'hire', from: 'readyForHire',  to: 'hired' },
              { name: 'fire', from: 'hired',  to: 'readyForHire' },
              { name: 'goto', from: '*', to: function(s) { return s } }
            ],
            methods: {
              onAppear: this.onAppear,
              onHire: this.onHire,
              onFire: this.onFire,
            }
        });

        this.stateMachine.goto(lastState);
    }

}