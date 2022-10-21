import IWebRocketRequest from "./IWebRocketRequest";
import IEventHandler from "./IEventHandler";

export default interface IAdapter {
    send: (message: IWebRocketRequest) => void;
    handler: IEventHandler;
}