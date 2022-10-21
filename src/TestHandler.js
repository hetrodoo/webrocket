function create() {
    return Object.freeze({
        listeners: new Map(),

        on(event, callback) {
            if (!this.listeners.has(event))
                this.listeners.set(event, []);

            this.listeners.get(event).push(callback);
        },

        onReceive(data) {
            if (!this.listeners.has('data'))
                return;

            this.listeners.get('data').forEach(callback => callback(data));
        },

        reset() {
            this.listeners = new Map();
        }
    });
}

module.exports = create;
