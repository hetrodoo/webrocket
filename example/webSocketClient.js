const WebSocket = require('ws');
const {WebRocket, WebRocketMethod} = require('../src');
const WebSocketAdapter = require('../src/WebSocketAdapter');

const ws = new WebSocket('ws://127.0.0.1:8080');

ws.on('open', () => {
    const clientAdapter = new WebSocketAdapter(ws);
    const webRocket = new WebRocket(clientAdapter);

    webRocket.on(WebRocketMethod.get, 'v1/test', (request, respond) => {
        respond('Ok from client.');
    });

    webRocket.get('v1/test').then(console.log).catch(console.error);
});
