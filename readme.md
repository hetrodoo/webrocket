[![WebRocket Logo](https://storage.googleapis.com/hetrodo-public/WebRocket.png)](https://webrocket.hetrodo.dev)

WebRocket is a framework for WebSockets, its purpose is to create an abstraction on top of WebSockets just like http
servers are on top of TCP/IP servers.

WebRocket simplify WebSockets usage by creating a rest api like interface.

```js
const WebSocket = require('ws');
const WebRocket = require('webrocket/lib/WebRocket');
const WebRocketMethod = require('webrocket/lib/WebRocketMethod');
const WebSocketAdapter = require('webrocket/lib/WebSocketAdapter');

//First we connect to the WebSocket server
const ws = new WebSocket('ws://127.0.0.1:8080');

//We wait for the connection to open
ws.on('open', () => {
    //With the connection open we instantiate the WebRocket class
    const clientAdapter = new WebSocketAdapter(ws);
    const webRocket = new WebRocket(clientAdapter);

    //Now we can register the client-side endpoints that we want using GET, POST, PUT, DELETE methods.
    webRocket.on(WebRocketMethod.get, 'v1/client-entity', (request, respond) => {
        respond({
            msg: 'Ok'
        });
    });

    webRocket.on(WebRocketMethod.post, 'v1/client-entity', (request, respond) => {
        respond({
            msg: 'Ok'
        });
    });

    webRocket.on(WebRocketMethod.put, 'v1/client-entity', (request, respond) => {
        respond({
            msg: 'Ok'
        });
    });

    webRocket.on(WebRocketMethod.delete, 'v1/client-entity', (request, respond) => {
        respond({
            msg: 'Ok'
        });
    });

    //And using the WebRocket's class instance we can make requests to the server-side defined endpoints
    webRocket.get('v1/server-entity').then(console.log).catch(console.error);
    webRocket.post('v1/server-entity').then(console.log).catch(console.error);
    webRocket.put('v1/server-entity').then(console.log).catch(console.error);
    webRocket.delete('v1/server-entity').then(console.log).catch(console.error);

    //You can use query params too
    webRocket.get('v1/server-entity?key=value').then(console.log).catch(console.error);
});
```
