[![WebRocket Logo](https://storage.googleapis.com/hetrodo-public/WebRocket.png)](http://expressjs.com/)

WebRocket is a wrapper for WebSockets, its purpose is to standardize the Websockets usage. It works just like restful APIs but there is no client nor server; both sides are transceivers.

```js
const WebSocket = require('ws');
const {WebRocket, WebRocketMethod, WebSocketAdapter} = require('webrocket');

const ws = new WebSocket('ws://127.0.0.1:8080');

ws.on('open', () => {
    const clientAdapter = new WebSocketAdapter(ws);
    const webRocket = new WebRocket(clientAdapter);

    webRocket.on(WebRocketMethod.get, 'v1/test', (request, respond) => {
        respond('Ok from client.');
    });

    webRocket.get('v1/test').then(console.log).catch(console.error);
});
```