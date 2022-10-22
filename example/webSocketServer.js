'use strict';

const webSocketServer = require('express');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const {WebRocket, WebRocketMethod} = require('../src');
const WebSocketAdapter = require('../src/WebSocketAdapter');

const app = webSocketServer();

const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', function (ws) {
    const clientAdapter = new WebSocketAdapter(ws);
    const webRocket = new WebRocket(clientAdapter);

    webRocket.on(WebRocketMethod.get, 'v1/test', (request, respond) => {
        respond('Ok from server.');
    });

    webRocket.get('v1/test').then(console.log).catch(console.error);

    ws.on('close', () => console.log('Closed.'));
});

server.listen(8080, function () {
    console.log('Listening on http://localhost:8080');
});