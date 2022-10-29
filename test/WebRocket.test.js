const {describe, it} = require('mocha');
const {noop} = require('mocha/lib/utils');
const {expect} = require('chai');
const chai = require('chai');
const sinon = require('sinon');
const WebRocket = require('../lib/WebRocket');
const TestAdapter = require('./tools/TestAdapter');
const WebRocketMethod = require('../lib/WebRocketMethod');

chai.use(require('chai-as-promised'));

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

    it('Should not throw', async function () {
        server.on(WebRocketMethod.get, route, (request, respond) => respond());
        await client.get(route);
    });

    it('Should throw a timeout error.', function () {
        expect(client.get(route)).to.be.rejectedWith('Request Timed out.');
    });

    it('Should be able to receive get requests.', function () {
        const listener = sinon.spy();

        server.on(WebRocketMethod.get, route, listener);
        client.get(route).then(noop).catch(noop);

        expect(listener.calledOnce).to.be.true;
    });

    it('Should match the payload when posting', function () {
        const listener = sinon.spy();

        server.on(WebRocketMethod.post, route, (request) => listener(request.data));
        client.post(route, payload).then(noop).catch(noop);

        expect(listener.calledWith(payload)).to.be.true;
    });

    it('Should match the payload when putting.', function () {
        const listener = sinon.spy();

        server.on(WebRocketMethod.put, route, (request) => listener(request.data));
        client.put(route, payload).then(noop).catch(noop);

        expect(listener.calledWith(payload)).to.be.true;
    });

    it('Should be able to receive delete requests.', function () {
        const listener = sinon.spy();

        server.on(WebRocketMethod.delete, route, listener);
        client.delete(route).then(noop).catch(noop);

        expect(listener.calledOnce).to.be.true;
    });

    it('Should be able to receive query params.', async function () {
        const listener = sinon.spy();

        server.on(WebRocketMethod.get, route, (request, respond) => {
            listener(request.data);
            respond();
        });
        await client.get(`${route}?foo=bar`);

        expect(listener.calledWith({foo: 'bar'})).to.be.true;
    });

    it('Should be able to remove listeners.', function () {
        server.on(WebRocketMethod.get, route, (request, respond) => respond({}));
        expect(server.removeListener(WebRocketMethod.get, route)).to.be.true;
    });

    it(`Should not be able to remove listeners that don't exist.`, function () {
        expect(server.removeListener(WebRocketMethod.get, route)).to.be.false;
    });
});
