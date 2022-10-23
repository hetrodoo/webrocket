const {describe, it} = require('mocha');
const {noop} = require('mocha/lib/utils');
const {expect} = require('chai');
const isEqual = require('lodash/isEqual');
const WebRocket = require('../lib/WebRocket');
const TestAdapter = require('./TestAdapter');
const WebRocketMethod = require('../lib/WebRocketMethod');

const buildData = () => {
    return {
        username: 'John Doe',
        age: '19'
    };
};

const buildTestSubject = () => {
    const clientAdapter = new TestAdapter();
    const serverAdapter = new TestAdapter();

    clientAdapter.attach(serverAdapter);
    serverAdapter.attach(clientAdapter);

    const client = new WebRocket(clientAdapter, 25);
    const server = new WebRocket(serverAdapter, 25);

    return {client, server};
};

describe('WebRocket', function () {
    const route = '/v1/example/route';
    let payload;
    let server;
    let client;

    beforeEach(function () {
        let {server: newServer, client: newClient} = buildTestSubject();
        payload = buildData();
        server = newServer;
        client = newClient;
    });

    it('Should timeout.', async function () {
        let requestFailed = false;

        try {
            await client.get(route);
        } catch (e) {
            requestFailed = true;
        }

        expect(requestFailed).to.be.true;
    });

    it('Should be able to receive requests.', function () {
        let requestReceived = false;

        server.on(WebRocketMethod.get, route, (request, respond) => {
            requestReceived = true;
            respond({});
        });

        client.get(route).then(noop).catch(noop);
        expect(requestReceived).to.be.true;
    });

    it('Should match the received data with the ones sent.', function () {
        let match = false;

        server.on(WebRocketMethod.post, route, (request, respond) => {
            match = isEqual(request.data, payload);
            respond({});
        });

        client.post(route, payload).then(noop).catch(noop);
        expect(match).to.be.true;
    });

    it('Should respond.', async function () {
        let requestFailed = false;

        server.on(WebRocketMethod.get, route, (request, respond) => {
            respond({});
        });

        try {
            await client.get(route);
        } catch (e) {
            requestFailed = true;
        }

        expect(requestFailed).to.be.false;
    });
});