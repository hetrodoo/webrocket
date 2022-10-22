module.exports = class WebSocketAdapter {
    _connection = undefined;
    listeners = [];

    constructor(connection) {
        this._connection = connection;

        this._connection.on('message', data => {
            const payload = JSON.parse(data);
            this.listeners.forEach(callback => callback(payload));
        });
    }

    send(message) {
        this._connection.send(JSON.stringify(message));
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }
}