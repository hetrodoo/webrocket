import IWebRocketResponse from "./IWebRocketResponse";
import IWebRocketRequest from "./IWebRocketRequest";

export default interface IEventHandler {
    [x: string]: unknown;

    on: (event: "data", callback: (data: IWebRocketResponse<unknown> | IWebRocketRequest) => void) => void;
}
