const {WebRocket, WebRocketMethod} = require("../src");
const ExampleAdapter = require("./ExampleAdapter");

const send = (data) => {
    ExampleAdapter.onReceive(data);
};

const webRocket = new WebRocket({
    send,
    handler: ExampleAdapter
});

(async () => {
    const sampleData = {
        username: "John",
        surename: "Doe",
        age: "19"
    };

    webRocket.on(WebRocketMethod.get, "v1/entity", (request, respond) => {
        respond({
            msg: "Get Ok"
        });
    });

    webRocket.on(WebRocketMethod.post, "v1/entity", (request, respond) => {
        respond({
            msg: "Post Ok"
        });
    });

    webRocket.on(WebRocketMethod.put, "v1/entity", (request, respond) => {
        respond({
            msg: "Put Ok"
        });
    });

    webRocket.on(WebRocketMethod.delete, "v1/entity", (request, respond) => {
        respond({
            msg: "Delete Ok"
        });
    });

    console.log("get:", await webRocket.get("v1/entity"));
    console.log("post:", await webRocket.post("v1/entity", sampleData));
    console.log("put:", await webRocket.put("v1/entity", sampleData));
    console.log("delete:", await webRocket.delete("v1/entity"));

})().catch(console.error);
