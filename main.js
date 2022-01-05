const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const path = require('path');
const ipc = ipcMain;
const fs = require('fs');

const DEV_TOOLS = false;
const FRAME = true;
const RESIZABLE = true;
const WIDTH = 900;
const HEIGHT = 750;
const root = path.join(__dirname, 'gui');
const dataPath = 'data.json';
let data;
let errors = false;

let mainWindow;

if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    const win = new BrowserWindow({
        icon: 'icon.png',
        minWidth: WIDTH,
        minHeight: HEIGHT,
        width: WIDTH,
        height: HEIGHT,
        resizable: RESIZABLE,
        frame: FRAME,
        autoHideMenuBar: true,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile(path.join(path.join(root, 'html'), 'home.html'), {query: {data: encode_b64(JSON.stringify(data))}});

    win.once('ready-to-show', () => {
        win.show();
        if (DEV_TOOLS) win.webContents.openDevTools();
    });

    mainWindow = win;
};

function encode_b64(str) {
    try {
        return btoa(str);
    } catch (err) {
        return Buffer.from(str).toString('base64');
    }
}

function decode_b64(str) {
    try {
        return btoa(str);
    } catch (err) {
        return Buffer.from(str).toString('base64');
    }
}

function showError(title, description, buttons) {
    return dialog.showMessageBox({
        title: title,
        type: 'error',
        detail: description,
        buttons: buttons
    });
}

function loadData() {
    try {
        if (fs.existsSync(dataPath)) {
            data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        } else {
            errors = true;
            showError('Data not found!', 'Server data not found, program cannot run without it.', ['Close']).then(() => app.quit());
        }
    } catch (e) {
        errors = true;
        showError('Data unreadable!', 'Server data is unreadable, program cannot run without it.', ['Close']).then(() => app.quit());
    }
}

app.on('ready', function () {
    loadData();
    if (!errors) createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        if (!errors) createWindow();
    }
});