class TestAdapter {
    listeners = [];
    targetAdapter = undefined;

    attach(adapter) {
        this.targetAdapter = adapter;
    }

    dispatch(message) {
        this.listeners.forEach(callback => callback(message));
    }

    send(message) {
        this.targetAdapter.dispatch(message);
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }
}

module.exports = TestAdapter;
