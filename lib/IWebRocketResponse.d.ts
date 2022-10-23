import IWebRocketPayload from "./IWebRocketPayload";

export default interface IWebRocketResponse<T> extends IWebRocketPayload<T> {
    rtt: number
}