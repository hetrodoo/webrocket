module.exports = class WebSocketAdapter {
    constructor(connection) {
        this.listeners = [];
        this._connection = connection;

        this._connection.onmessage = ({ data }) => {
            const payload = JSON.parse(data);
            this.listeners.forEach(callback => callback(payload));
        };
    }

    send(message) {
        this._connection.send(JSON.stringify(message));
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }
};