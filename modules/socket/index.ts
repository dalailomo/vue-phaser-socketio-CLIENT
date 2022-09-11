import { io } from "socket.io-client";

export const connect = (url: string, name: string) => {
    const socket = io(url, {
        query: {
            name
        }
    });

    // socket.onAny((event, ...args) => {
    //     console.log(event, args);
    // });

    return socket;
}
