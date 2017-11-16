import * as electron from "electron";
import { Socket } from "./socket";

export default (socket: Socket, app: Electron.App): Electron.App => {
    let isWebAppClosed = false;

    app.on('window-all-closed', () => {
        if (!isWebAppClosed) {
            socket.emit('window-all-closed');
        } else {
            app.quit();
        }
    });

    socket.on('app-quit', () => {
        isWebAppClosed = true;
        app.quit();
    });
    return app;
}

/*
  electron lifecycle

  App.will-finish-launching
  App.ready
  App.web-contents-created
  App.browser-window-created
  ...
  App.window-all-closed
  App.before-quit
  App.will-quit
  App.quit
  BrowserWindow.closed
*/