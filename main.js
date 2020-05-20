"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var connectionstatus_1 = require("./src/app/general/connectionstatus");
var contextMenu = require('electron-context-menu');
contextMenu(); // adds right click inspect in dev mode
var win = null;
var args = process.argv.slice(1), serve = args.some(function (val) { return val === '--serve'; });
var DownloadManager = require("electron-download-manager");
DownloadManager.register();
require('dotenv').config();
/* CONNECTION STATUS START */
var connection = new connectionstatus_1.ConnectionStatus();
electron_1.ipcMain.on('is-online', function (event, arg) {
    event.returnValue = connection.isConnected();
});
/* CONNECTION STATUS END */
var loadingScreen = null;
var createLoadingScreen = function () {
    loadingScreen = new electron_1.BrowserWindow(Object.assign({
        /// define width and height for the window
        width: 1280,
        height: 720,
        /// remove the window frame, so it will become a frameless window
        frame: false,
        /// and set the transparency, to remove any window background color
        transparent: true
    }));
    loadingScreen.resizable = false;
    loadingScreen.loadURL(url.format({
        pathname: path.join(__dirname, 'dist/assets/loading.html'),
        protocol: 'file:',
        slashes: true
    }));
    loadingScreen.on('closed', function () { return (loadingScreen = null); });
    loadingScreen.webContents.on('did-finish-load', function () {
        loadingScreen.show();
    });
};
function createWindow() {
    var electronScreen = electron_1.screen;
    var size = electronScreen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        //width: 1280,
        width: 1800,
        height: 720,
        minWidth: 582,
        minHeight: 112.5,
        resizable: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            allowRunningInsecureContent: (serve) ? true : false,
        },
        show: false
    });
    if (serve) {
        require('electron-reload')(__dirname, {
            electron: require(__dirname + "/node_modules/electron")
        });
        win.loadURL('http://localhost:4200');
    }
    else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
    if (serve) {
        win.webContents.openDevTools();
    }
    win.on('closed', function () {
        win = null;
    });
    win.webContents.on('did-finish-load', function () {
        if (loadingScreen)
            loadingScreen.close();
        win.show();
    });
    //Menu.setApplicationMenu(Menu.buildFromTemplate([])) <- removes CMD + R (refresh) on OS X
    //win.removeMenu(); <- Removes CTRL + R (refresh) on Windows
    return win;
}
try {
    electron_1.app.allowRendererProcessReuse = true;
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    electron_1.app.on('ready', function () {
        createLoadingScreen();
        createWindow();
        //setTimeout(createLoadingScreen, 400)
    });
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
    // Catch Error
    // throw e;
}
//# sourceMappingURL=main.js.map