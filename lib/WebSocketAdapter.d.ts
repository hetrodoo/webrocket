import {WebSocket} from "ws";
import IAdapter, {Listener} from "./IAdapter";
import IWebRocketRequest from "./IWebRocketRequest";

export default class WebSocketAdapter implements IAdapter {
    constructor(connection: WebSocket);

    send(message: IWebRocketRequest): void;

    subscribe(listener: Listener): void;
}