var StateMachine = require('javascript-state-machine');
var Storage = require('node-storage');

module.exports = class FactionState {
    stateMachine = null;
    state_store = new Storage('./data/state_data');
    faction_key;

    constructor(faction_key) {
        this.faction_key = faction_key;
        this.stateForFaction();
    }

    isBattling() {
        return this.stateMachine.state === "battling";
    }

    isCasting() {
        return this.stateMachine.state === "casting";
    }

    isIdle() {
        return this.stateMachine.state === "idle";
    }

    battle (faction_key) {
        this.state_store.put(this.faction_key + ".battling", faction_key);
        this.stateMachine.battle();
    }

    castSpell(target_faction_key, spell_key) {
        this.state_store.put(this.faction_key + ".castingAgainst", target_faction_key);
        this.state_store.put(this.faction_key + ".spell", spell_key);
        this.stateMachine.castSpell();
    }

    battlingWho() {
        return this.state_store.get(this.faction_key + ".battling");
    }

    castingAgainstWho() {
        return this.state_store.get(this.faction_key + ".castingAgainst");
    }

    castingWhichSpell() {
        return this.state_store.get(this.faction_key + ".spell");
    }

    cancelBattle () {
        this.state_store.remove(this.faction_key + ".battling");
        this.stateMachine.cancelBattle();
    }

    finishBattle () {
        this.state_store.remove(this.faction_key + ".battling");
        this.stateMachine.finishBattle();
    }

    cancelSpell () {
        this.state_store.remove(this.faction_key + ".castingAgainst");
        this.state_store.remove(this.faction_key + ".spell");
        this.stateMachine.cancelSpell();
    }

    finishSpell () {
        this.state_store.remove(this.faction_key + ".castingAgainst");
        this.state_store.remove(this.faction_key + ".spell");
        this.stateMachine.finishSpell();
    }

    onBattle = () =>  {
        this.saveCurrentState();
    }

    onCancelBattle = () =>  {
        this.saveCurrentState();
    }

    onFinishBattle = () => {
        this.saveCurrentState();
    }

    onCastSpell = () =>  {
        this.saveCurrentState();
    }

    onCancelSpell = () =>  {
        this.saveCurrentState();
    }

    onFinishSpell = () => {
        this.saveCurrentState();
    }


    saveCurrentState = () =>  {
        this.state_store.put(this.faction_key + ".lastState", this.stateMachine.state);
    }

    stateForFaction = () => {
        let lastState = this.state_store.get(this.faction_key + ".lastState");
        if(!lastState) {
            lastState = "idle";
        }

        this.stateMachine = new StateMachine({
            init: "idle",
            transitions: [
              { name: 'battle', from: 'idle',  to: 'battling' },
              { name: 'castSpell', from: 'idle',  to: 'casting' },
              { name: 'cancelBattle', from: 'battling',  to: 'idle' },
              { name: 'finishBattle', from: 'battling', to: 'idle' },
              { name: 'cancelSpell', from: 'casting',  to: 'idle' },
              { name: 'finshSpell', from: 'casting', to: 'idle' },
              { name: 'goto', from: '*', to: function(s) { return s } }
            ],
            methods: {
              onBattle: this.onBattle,
              onCancelBattle: this.onCancelBattle,
              onFinishBattle: this.onFinishBattle,
              onCastSpell: this.onCastSpell,
              onCancelSpell: this.onCancelSpell,
              onFinishSpell: this.onFinishSpell,
            }
        });

        this.stateMachine.goto(lastState);
    }

}