import { BrowserWindow } from "electron";
import { Socket } from "./socket";

export default (socket: Socket, window: BrowserWindow) => {
    socket.on('now-time', (time: string) => {
        window.webContents.send('show-time', time);
    });
}