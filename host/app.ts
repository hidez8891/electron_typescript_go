import api from "./api";
import { spawn, ChildProcess } from "child_process";
import { app, BrowserWindow } from "electron";
import * as os from "os";
import * as path from "path";
import { Socket } from "./socket";

let window: BrowserWindow;
let webproc: ChildProcess;
let socket: Socket;

app.on('ready', () => {
    let port = 48075;
    startWebApp(port);

    socket = new Socket(port);
    socket.on('connect', () => {
        console.log("web connected");
        api(socket, app);
    });
    socket.connection();

    let url = `http://localhost:${port}/`;
    window = new BrowserWindow({ width: 800, height: 600 });
    window.loadURL(url);
    window.on('closed', () => {
        window = null;
    });
});

function startWebApp(host_port: number) {
    const params = [`--port=${host_port}`];

    let binfile = 'web';
    if (os.platform() === "win32") {
        binfile += ".exe";
    }

    const bindir = path.join(__dirname, '../web');
    const binpath = path.join(bindir, binfile);
    webproc = spawn(binpath, params, { "cwd": bindir });

    webproc.stdout.on('data', (data) => {
        console.log(`web process stdout: ${data.toString()}`);
    });
    webproc.stderr.on('data', (data) => {
        console.log(`web process stderr: ${data.toString()}`);
    });
}