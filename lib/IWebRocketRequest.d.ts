import WebRocketMethod from "./WebRocketMethod";
import IWebRocketPayload from "./IWebRocketPayload";

export default interface IWebRocketRequest extends IWebRocketPayload<unknown> {
    route: string
    method: WebRocketMethod
}