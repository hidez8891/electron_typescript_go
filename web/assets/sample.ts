//import { ipcRenderer } from "electron"
const ipcRenderer = require("electron").ipcRenderer;

ipcRenderer.on('show-time', (event: Event, time: string) => {
    let e = document.createElement("div");
    e.innerText = time;

    let div = document.getElementById("time");
    div.appendChild(e);
});