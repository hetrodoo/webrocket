const {WebRocket, WebRocketMethod, TestHandler} = require("../src");

const clientHandler = TestHandler();
const serverHandler = TestHandler();

const client = new WebRocket({
    send: (data) => serverHandler.onReceive(data),
    handler: clientHandler
});

const server = new WebRocket({
    send: (data) => clientHandler.onReceive(data),
    handler: serverHandler
});

(async () => {
    const sampleData = {
        username: "John",
        surename: "Doe",
        age: "19"
    };

    server.on(WebRocketMethod.get, "v1/entity", (request, respond) => {
        respond({
            msg: "Get Ok"
        });
    });

    server.on(WebRocketMethod.post, "v1/entity", (request, respond) => {
        respond({
            msg: "Post Ok"
        });
    });

    server.on(WebRocketMethod.put, "v1/entity", (request, respond) => {
        respond({
            msg: "Put Ok"
        });
    });

    server.on(WebRocketMethod.delete, "v1/entity", (request, respond) => {
        respond({
            msg: "Delete Ok"
        });
    });

    console.log("get:", await client.get("v1/entity"));
    console.log("post:", await client.post("v1/entity", sampleData));
    console.log("put:", await client.put("v1/entity", sampleData));
    console.log("delete:", await client.delete("v1/entity"));

})().catch(console.error);
