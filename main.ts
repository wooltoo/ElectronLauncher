import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { ConnectionStatus } from './src/app/general/connectionstatus';
const contextMenu = require('electron-context-menu');
contextMenu(); // adds right click inspect in dev mode

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

const DownloadManager = require("electron-download-manager"); 
DownloadManager.register();
require('dotenv').config();

/* CONNECTION STATUS START */

let connection : ConnectionStatus = new ConnectionStatus();
ipcMain.on('is-online', (event, arg) => {
  event.returnValue = connection.isConnected();
});

/* CONNECTION STATUS END */
let loadingScreen : BrowserWindow = null;
const createLoadingScreen = () => {
  loadingScreen = new BrowserWindow(
    Object.assign({
      /// define width and height for the window
      width: 1280,
      height: 720,
      /// remove the window frame, so it will become a frameless window
      frame: false,
      /// and set the transparency, to remove any window background color
      transparent: true
    })
  );
  loadingScreen.resizable = false;

  loadingScreen.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/assets/loading.html'),
    protocol: 'file:',
    slashes: true
  }));
  loadingScreen.on('closed', () => (loadingScreen = null));
  loadingScreen.webContents.on('did-finish-load', () => {
    loadingScreen.show();
  });
}

function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
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
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  if (serve) {
    win.webContents.openDevTools();
  }

  win.on('closed', () => {
    win = null;
  });

  win.webContents.on('did-finish-load', () => {
    if (loadingScreen)
      loadingScreen.close();

    win.show();
  });

  //Menu.setApplicationMenu(Menu.buildFromTemplate([])) <- removes CMD + R (refresh) on OS X
  //win.removeMenu(); <- Removes CTRL + R (refresh) on Windows

  return win;
}

try {

  app.allowRendererProcessReuse = true;

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => {
    createLoadingScreen();
    createWindow();
    //setTimeout(createLoadingScreen, 400)
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
