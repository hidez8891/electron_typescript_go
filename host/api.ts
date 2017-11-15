import * as electron from "electron";
import { Socket } from "./socket";

export default (socket: Socket, app: Electron.App): Electron.App => {
    app.on('window-all-closed', () => {
        app.quit();
    });
    return app;
}

/*
  electron lifecycle

  App.will-finish-launching
  App.web-contents-created
  App.browser-window-created
  App.ready
  ...
  App.before-quit
  App.will-quit
  App.quit
  App.window-all-closed
  BrowserWindow.closed
*/