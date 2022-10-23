export default interface IWebRocketPayload<T> {
    data: T
    uuid: string
    type: number
}