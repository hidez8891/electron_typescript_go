import { client, connection } from "websocket";
import { EventEmitter } from "events";
import { BrowserView, BrowserWindow } from "electron";

interface Message {
    name: string;
    argc: number;
    argv: string[];
}

export class Socket {
    private url: string;
    private event: EventEmitter;
    private client: client;
    private connect: connection;
    private window: BrowserWindow;

    constructor(port: number, window: BrowserWindow) {
        this.url = `ws://localhost:${port}/api/`
        this.window = window;
        this.event = new EventEmitter;
        this.client = new client();
        this.setConnectEvent();
    }

    connection(): Socket {
        this.client.connect(this.url);
        return this;
    }

    close() {
        this.connect.close();
        this.connect = null;
    }

    on(name: string, func: Function): Socket {
        this.event.on(name, func);
        return this;
    }

    once(name: string, func: Function): Socket {
        this.event.once(name, func);
        return this;
    }

    emit(name: string, ...args: any[]): Socket {
        this.sendMessage(name, args)
        return this;
    }

    private setConnectEvent() {
        this.client.on('connect', (connect) => {
            this.connect = connect;
            this.setIOEvent();
            this.event.emit('connect', this);
        });
        this.client.on('connectFailed', (err: Error) => {
            this.event.emit('error', err);
        });
    }

    private setIOEvent() {
        this.connect.on('message', (data) => {
            if (data.type !== "utf8") {
                console.log(`socket: receive unsupport type ${data.type}`);
                return; // unsupport
            }

            //console.log(`socket: recv message ${data.utf8Data}`);
            let msg: Message = JSON.parse(data.utf8Data);
            if (!this.event.emit(msg.name, ...msg.argv)) {
                this.window.webContents.send(msg.name, ...msg.argv);
            }
        });
    }

    private sendMessage(name: string, args: any[]) {
        let msg = JSON.stringify(<Message>{
            name: name,
            argc: args.length,
            argv: args
        });

        if (this.connect != null) {
            //console.log(`socket: send message ${msg}`);
            this.connect.send(msg);
        }
    }
}