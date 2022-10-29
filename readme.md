[![WebRocket Logo](https://storage.googleapis.com/hetrodo-public/WebRocket.png)](https://webrocket.hetrodo.dev)

[![Build](https://img.shields.io/circleci/build/github/hetrodoo/webrocket/master?label=Pipeline)](https://app.circleci.com/pipelines/github/hetrodoo/webrocket)
[![License](https://img.shields.io/github/license/hetrodoo/webrocket?color=blue)](https://github.com/hetrodoo/webrocket/blob/master/LICENSE)
[![Support](https://img.shields.io/badge/Support-Buy%20Me%20A%20Coffee-yellow)](https://www.buymeacoffee.com/hetrodo)

WebRocket is a framework for WebSockets, its purpose is to create an abstraction on top of WebSockets just like http
servers are on top of TCP/IP servers.

WebRocket simplify WebSockets usage by creating a rest api like interface.

[Client example project](https://github.com/hetrodoo/webrocket-client-example)

[Server example project](https://github.com/hetrodoo/webrocket-server-example)

### Client

```bash
yarn add @hetrodo/webrocket
```

```js
const WebRocket = require('@hetrodo/webrocket/lib/WebRocket');
const WebRocketMethod = require('@hetrodo/webrocket/lib/WebRocketMethod');
const WebSocketAdapter = require('@hetrodo/webrocket/lib/WebSocketAdapter');

//First we connect to the WebSocket server
const ws = new WebSocket('ws://127.0.0.1:8080');

//We wait for the connection to open
ws.onopen = () => {
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
    webRocket.post('v1/server-entity', {}).then(console.log).catch(console.error);
    webRocket.put('v1/server-entity', {}).then(console.log).catch(console.error);
    webRocket.delete('v1/server-entity').then(console.log).catch(console.error);

    //You can use query params too
    webRocket.get('v1/server-entity?key=value').then(console.log).catch(console.error);
};
```

### Server

```bash
yarn add express ws @hetrodo/webrocket
```

```js
const express = require('express');
const {createServer} = require('http');
const {WebSocketServer} = require('ws');
const WebRocket = require('@hetrodo/webrocket');
const WebRocketMethod = require('@hetrodo/webrocket/lib/WebRocketMethod');
const WebSocketAdapter = require('@hetrodo/webrocket/lib/WebSocketAdapter');

//Create your WebSocket server
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({server});

wss.on('connection', function (ws) {
    //When a connection established we can instantiate a new WebRocket.
    const webRocket = new WebRocket(new WebSocketAdapter(ws));

    //Now we can register the server-side endpoints that we want using GET, POST, PUT, DELETE methods.
    webRocket.on(WebRocketMethod.get, 'v1/server-entity', (request, respond) => {
        respond({
            msg: 'Ok'
        });
    });

    webRocket.on(WebRocketMethod.post, 'v1/server-entity', (request, respond) => {
        respond({
            msg: 'Ok'
        });
    });

    webRocket.on(WebRocketMethod.put, 'v1/server-entity', (request, respond) => {
        respond({
            msg: 'Ok'
        });
    });

    webRocket.on(WebRocketMethod.delete, 'v1/server-entity', (request, respond) => {
        respond({
            msg: 'Ok'
        });
    });

    //And using the WebRocket's class instance we can make requests to the client-side defined endpoints
    webRocket.get('v1/client-entity').then(console.log).catch(console.error);
    webRocket.post('v1/client-entity', {}).then(console.log).catch(console.error);
    webRocket.put('v1/client-entity', {}).then(console.log).catch(console.error);
    webRocket.delete('v1/client-entity').then(console.log).catch(console.error);

    //Just like in the client side you can use query params too
    webRocket.get('v1/client-entity?key=value').then(console.log).catch(console.error);
});

server.listen(8080, function () {
    console.log('Listening on http://localhost:8080');
});
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
