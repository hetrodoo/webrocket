import IWebRocketRequest from "./IWebRocketRequest";
import IWebRocketResponse from "./IWebRocketResponse";
import WebRocketMethod from "./WebRocketMethod";
import IAdapter from "./IAdapter";

export default class WebRocket {
    constructor(adapter: IAdapter, timeout?: number);

    public get<T>(route: string): Promise<IWebRocketResponse<T>>;

    public post<T, G>(route: string, data: T): Promise<IWebRocketResponse<G>>;

    public put<T, G>(route: string, data: T): Promise<IWebRocketResponse<G>>;

    public delete<T, G>(route: string): Promise<IWebRocketResponse<G>>;

    public on(method: WebRocketMethod, route: string, callback: (request: IWebRocketRequest, respond: (data: unknown) => void) => (Promise<void> | void)): void;

    public removeListener(method: WebRocketMethod, route: string): boolean;
}
