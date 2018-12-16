'use strict';

const STATE = {
    WAITING: 0,
    WORKING: 1
};

class State {
    constructor () {
        this.state = STATE.WAITING;
    }

    isWorking () {
        return this.state === STATE.WORKING
    }

    isWaiting () {
        return this.state === STATE.WAITING
    }

    setState (newState) {
        this.state = newState;
    }
};

module.exports = {
    STATE,
    State
};
