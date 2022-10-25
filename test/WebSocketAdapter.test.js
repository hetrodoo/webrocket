const {describe, it} = require('mocha');
const {expect} = require('chai');
const isEqual = require('lodash/isEqual');
const {EventEmitter} = require('events');
const WebSocketAdapter = require('../lib/WebSocketAdapter');

describe('WebSocketAdapter', function () {
    const webSocketEvents = new EventEmitter();
    let adapter;

    beforeEach(() => {
        const mockWebSocket = {
            onmessage: undefined,
            send: (data) => {
                webSocketEvents.emit('sent', data);
            }
        };

        webSocketEvents.once('message', (data) => mockWebSocket.onmessage(data));
        adapter = new WebSocketAdapter(mockWebSocket);
    });

    it('Should receive messages.', function () {
        const messageEvent = {
            data: '{ "key": "value" }'
        };
        const data = JSON.parse(messageEvent.data);
        let received;

        adapter.subscribe(value => received = value);
        webSocketEvents.emit('message', messageEvent);

        expect(isEqual(data, received)).to.be.true;
    });

    it('Should be able to send.', function () {
        const strData = '{"key":"value"}';
        const data = JSON.parse(strData);
        let received;

        webSocketEvents.once('sent', value => received = value);
        adapter.send(data);

        expect(isEqual(strData, received)).to.be.true;
    });
});
