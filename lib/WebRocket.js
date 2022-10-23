'use strict';
const {v4: uuidV4} = require('uuid');
const PayloadType = require('./PayloadType');
const WebRocketMethod = require('./WebRocketMethod');

async function makeRequest(method, route, data, webRocket) {
    const uuid = uuidV4(null, null, null);

    const returnPromise = new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            webRocket._waitMap.delete(uuid);
            reject('Request Timed out.');
        }, webRocket._timeout);

        const release = (data) => {
            webRocket._waitMap.delete(uuid);
            clearTimeout(timeoutId);
            resolve(data);
        };

        webRocket._waitMap.set(uuid, release);
    });

    webRocket._adapter.send({
        route,
        method,
        data,
        uuid,
        type: PayloadType.request
    });

    return await returnPromise;
}

class WebRocket {
    constructor(adapter, timeout = 5000) {
        this._callbackMap = new Map();
        this._adapter = adapter;
        this._waitMap = new Map();
        this._timeout = timeout;

        Object.values(WebRocketMethod).forEach(value => {
            this._callbackMap.set(value, new Map());
        });

        this._adapter.subscribe((data) => {
            if (!data.uuid || data.type !== PayloadType.request || !this._callbackMap.has(data.method))
                return;

            const routes = this._callbackMap.get(data.method);

            if (!routes.has(data.route))
                return;

            routes.get(data.route)(data, (response) => {
                this._adapter.send({
                    route: data.route,
                    method: data.method,
                    uuid: data.uuid,
                    data: response,
                    type: PayloadType.response
                });
            });
        });
        this._adapter.subscribe((data) => {
            if (!data.uuid || data.type !== PayloadType.response || !this._waitMap.has(data.uuid))
                return;

            this._waitMap.get(data.uuid)(data);
        });
    }

    async get(route) {
        return await makeRequest(WebRocketMethod.get, route, null, this);
    }

    async post(route, data) {
        return await makeRequest(WebRocketMethod.post, route, data, this);
    }

    async put(route, data) {
        return await makeRequest(WebRocketMethod.put, route, data, this);
    }

    async delete(route) {
        return await makeRequest(WebRocketMethod.delete, route, null, this);
    }

    on(method, route, callback) {
        this._callbackMap.get(method).set(route, callback);
    }

    removeListener(method, route) {
        const routes = this._callbackMap.get(method);

        if (!routes.has(route))
            return;

        routes.delete(route);
    }
}

module.exports = WebRocket;