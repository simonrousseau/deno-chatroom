import { WebSocket, isWebSocketCloseEvent } from 'https://deno.land/std/ws/mod.ts';
import { v4 } from 'https://deno.land/std/uuid/mod.ts';

let sockets = new Map<string, WebSocket>();

interface BroadcastObj {
    name: string,
    mssg: string
}

// broadcast events to all clients
const broadcastEvent = (obj: BroadcastObj) => {
    sockets.forEach((ws: WebSocket) => {
        ws.send(JSON.stringify(obj))
    })
}

const chatConnection = async (ws: WebSocket) => {
    console.log("New socket connection")

    // add new websocket connection to map
    const id = v4.generate()
    sockets.set(id, ws);

    for await (const ev of ws) {
        console.log(ev)

        // delete socket if connection closed
        if (isWebSocketCloseEvent(ev)) {
            sockets.delete(id)
        }

        // create ev object if ev is string
        if (typeof ev === "string") {
            let evObj = JSON.parse(ev)
            broadcastEvent(evObj)
        }
    }
}

export { chatConnection };