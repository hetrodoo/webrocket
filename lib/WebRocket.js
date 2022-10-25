'use strict';
const {v4: uuidV4} = require('uuid');
const PayloadType = require('./PayloadType');
const WebRocketMethod = require('./WebRocketMethod');
const {filterRoute, parseQueryRoute} = require('./Utils');

class WebRocket {
    #callbackMap;
    #adapter;
    #waitMap;
    #timeout;

    /* istanbul ignore next */
    constructor(adapter, timeout = 5000) {
        this.#callbackMap = new Map();
        this.#adapter = adapter;
        this.#waitMap = new Map();
        this.#timeout = timeout;

        Object.values(WebRocketMethod).forEach(value => {
            this.#callbackMap.set(value, new Map());
        });

        this.#adapter.subscribe((data) => {
            if (!data.uuid || data.type !== PayloadType.request || !this.#callbackMap.has(data.method))
                return;

            const routes = this.#callbackMap.get(data.method);
            const {route, params} = parseQueryRoute(data.route);

            if (!routes.has(route))
                return;

            data.data = {...data.data, ...params};

            routes.get(route)(data, (response) => {
                this.#adapter.send({
                    route: data.route,
                    method: data.method,
                    uuid: data.uuid,
                    data: response,
                    type: PayloadType.response
                });
            });
        });
        this.#adapter.subscribe((data) => {
            if (!data.uuid || data.type !== PayloadType.response || !this.#waitMap.has(data.uuid))
                return;

            this.#waitMap.get(data.uuid)(data);
        });
    }

    async get(route) {
        return await this.#makeRequest(WebRocketMethod.get, route, null, this);
    }

    async post(route, data) {
        return await this.#makeRequest(WebRocketMethod.post, route, data, this);
    }

    async put(route, data) {
        return await this.#makeRequest(WebRocketMethod.put, route, data, this);
    }

    async delete(route) {
        return await this.#makeRequest(WebRocketMethod.delete, route, null, this);
    }

    on(method, route, callback) {
        this.#callbackMap.get(method).set(filterRoute(route), callback);
    }

    removeListener(method, route) {
        const routes = this.#callbackMap.get(method);

        if (routes.has(filterRoute(route))) {
            routes.delete(filterRoute(route));
            return true;
        } else {
            return false;
        }
    }

    async #makeRequest(method, route, data) {
        const uuid = uuidV4(null, null, null);

        const returnPromise = new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                this.#waitMap.delete(uuid);
                reject('Request Timed out.');
            }, this.#timeout);

            const release = (data) => {
                this.#waitMap.delete(uuid);
                clearTimeout(timeoutId);
                resolve(data);
            };

            this.#waitMap.set(uuid, release);
        });

        this.#adapter.send({
            route: filterRoute(route),
            method,
            data,
            uuid,
            type: PayloadType.request
        });

        return await returnPromise;
    }
}

module.exports = WebRocket;
