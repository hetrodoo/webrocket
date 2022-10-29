export default class EventEmitter {
    constructor();
    on(event: string, listener: Function): void;
    off(event: string, listener: Function): void;
    emit(event: string, ...args: any[]): void;
    once(event: string, listener: Function): void;
}
