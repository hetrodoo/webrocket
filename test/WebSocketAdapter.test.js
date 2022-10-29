const {describe, it} = require('mocha');
const {expect} = require('chai');
const sinon = require('sinon');
const EventEmitter = require('../lib/EventEmitter');
const WebSocketAdapter = require('../lib/WebSocketAdapter');

describe('WebSocketAdapter', function () {
    let eventListener = new EventEmitter();
    let adapter;

    beforeEach(() => {
        const mockWebSocket = {
            onmessage: undefined,
            send: (data) => eventListener.emit('sent', data)
        };

        eventListener.once('message', (data) => mockWebSocket.onmessage(data));
        adapter = new WebSocketAdapter(mockWebSocket);
    });

    it('Should receive messages.', function () {
        const listener = sinon.spy();
        const messageEvent = {
            data: '{ "key": "value" }'
        };
        const data = JSON.parse(messageEvent.data);

        adapter.subscribe(listener);
        eventListener.emit('message', messageEvent);

        expect(listener.calledWith(data)).to.be.true;
    });

    it('Should be able to send.', function () {
        const listener = sinon.spy();
        const strData = '{"key":"value"}';
        const data = JSON.parse(strData);

        eventListener.once('sent', listener);
        adapter.send(data);

        expect(listener.calledWith(strData)).to.be.true;
    });
});
