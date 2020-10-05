import io from "socket.io-client";

const SOCKET_PORT = 4001;

class SIOWebSocket {
    constructor() {
        this.socket = io.connect(
            `${window.location.protocol}//${window.location.hostname}:${SOCKET_PORT}`
        );
    }

    on(event, ack) {
        this.socket.on(event, ack);
    }

    emit(event, data) {
        this.socket.emit(event, data);
    }

    off(event) {
        this.socket.off(event);
    }
}

const socket = new SIOWebSocket();
export default socket;
