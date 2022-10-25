import IWebRocketResponse from "./IWebRocketResponse";
import IWebRocketRequest from "./IWebRocketRequest";

export type Listener = (data: IWebRocketResponse<unknown> | IWebRocketRequest) => void;

export default interface IAdapter {
    send: (message: IWebRocketRequest) => void;
    subscribe: (listener: Listener) => void;
}
