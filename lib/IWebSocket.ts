export default interface IWebSocket {
    onmessage: (({ data }) => any) | any
    send: (data: any) => void
}