import IAdapter, {Listener} from "./IAdapter";
import IWebRocketRequest from "./IWebRocketRequest";

export default class TestAdapter implements IAdapter {
    attach(adapter: TestAdapter): void

    dispatch(message: IWebRocketRequest): void

    send(message: IWebRocketRequest): void

    subscribe(listener: Listener): void
}
