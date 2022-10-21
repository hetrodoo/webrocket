const {describe, it} = require("mocha");
const {noop} = require("mocha/lib/utils");
const {expect} = require("chai");
const isEqual = require("lodash/isEqual");
const {WebRocket, WebRocketMethod, TestHandler} = require("../src");

describe("WebRocket Index", function () {
    const payload = Object.freeze({
        username: "John",
        surename: "Doe",
        age: "19"
    });
    const route = '/v1/example/route';
    const clientAdapter = TestHandler();
    const serverAdapter = TestHandler();

    const client = new WebRocket({
        send: (data) => serverAdapter.onReceive(data),
        handler: clientAdapter
    }, 25);

    const server = new WebRocket({
        send: (data) => clientAdapter.onReceive(data),
        handler: serverAdapter
    }, 25);

    beforeEach(() => {
        clientAdapter.reset();
        serverAdapter.reset();

        Object.values(WebRocketMethod).forEach(value => {
            client.getRoutesFor(value).forEach(route => client.removeListener(value, route));
            server.getRoutesFor(value).forEach(route => server.removeListener(value, route));
        });
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