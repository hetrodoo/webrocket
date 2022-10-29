//A class that using Map can be used to subscribe to multiple events.
class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    // Subscribe to an event
    on(event, listener) {
        if (!this.events.has(event)) this.events.set(event, []);
        this.events.get(event).push(listener);
    }

    // Unsubscribe from an event
    off(event, listener) {
        let listeners = this.events.get(event);
        if (!listeners) return;
        listeners.splice(listeners.indexOf(listener), 1);
    }

    // Emit an event
    emit(event, ...args) {
        let listeners = this.events.get(event);
        if (!listeners) return;
        listeners.forEach(listener => listener(...args));
    }

    // Subscribe to an event once
    once(event, listener) {
        let wrapper = (...args) => {
            listener(...args);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
}

module.exports = EventEmitter;
