import IWebSocket from "./IWebSocket";
import IAdapter, {Listener} from "./IAdapter";
import IWebRocketRequest from "./IWebRocketRequest";

export default class WebSocketAdapter implements IAdapter {
    constructor(connection: IWebSocket);

    send(message: IWebRocketRequest): void;

    subscribe(listener: Listener): void;
}