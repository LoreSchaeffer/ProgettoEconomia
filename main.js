const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const ipc = ipcMain;
const fs = require('fs');

const DEV_TOOLS = true;
const FRAME = true;
const root = path.join(__dirname, 'gui');

let mainWindow;

//Use this method to receive messages from the renderer process
//ipc.on('command', (event, arg) => {});

if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    const win = new BrowserWindow({
        icon: 'icon.png',
        width: 800,
        height: 600,
        resizable: false,
        frame: FRAME,
        autoHideMenuBar: true,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile(path.join(path.join(root, 'html'), 'home.html'), {query: {}});

    win.once('ready-to-show', () => {
        win.show();
        if (DEV_TOOLS) win.webContents.openDevTools();
    });

    mainWindow = win;
};

app.on('ready', function () {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});