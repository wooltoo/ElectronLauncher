"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var win = null;
var args = process.argv.slice(1), serve = args.some(function (val) { return val === '--serve'; });
var DownloadManager = require("electron-download-manager");
DownloadManager.register();
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
    loadingScreen.resizable = true;
    /*loadingScreen.loadURL(
      "assets/loading.html"
    );*/
    loadingScreen.loadURL(url.format({
        pathname: path.join(__dirname, 'src/assets/loading.html'),
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
        width: 1280,
        height: 720,
        minWidth: 582,
        minHeight: 112.5,
        resizable: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
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
    // Emitted when the window is closed.
    win.on('closed', function () {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
    win.webContents.on('did-finish-load', function () {
        if (loadingScreen)
            loadingScreen.close();
        win.show();
    });
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