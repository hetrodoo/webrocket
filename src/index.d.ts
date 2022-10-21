export interface IEventHandler {
    [x: string]: unknown;

    on: (event: "data", callback: (data: IWebRocketResponse<unknown> | IWebRocketRequest) => void) => void;
}

export interface IAdapter {
    send: (message: IWebRocketRequest) => void;
    handler: IEventHandler;
}

export interface IWebRocketPayload<T> {
    data: T
    uuid: string
    type: number
}

export interface IWebRocketRequest extends IWebRocketPayload<unknown> {
    route: string
    method: WebRocketMethod
}

export interface IWebRocketResponse<T> extends IWebRocketPayload<T> {
    rtt: number
}

export enum WebRocketMethod {
    get = 0,
    post = 1,
    put = 2,
    delete = 3
}

declare type Respond = (data: unknown) => void;
declare type Listener = (request: IWebRocketRequest, respond: Respond) => Promise<void>;

export class WebRocket {
    constructor(adapter: IAdapter, timeout?: number);

    public get<T>(route: string): Promise<IWebRocketResponse<T>>;

    public post<T, G>(route: string, data: T): Promise<IWebRocketResponse<G>>;

    public put<T, G>(route: string, data: T): Promise<IWebRocketResponse<G>>;

    public delete<T, G>(route: string): Promise<IWebRocketResponse<G>>;

    public on(method: WebRocketMethod, route: string, callback: Listener): void;
}