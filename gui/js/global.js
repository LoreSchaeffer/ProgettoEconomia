const {ipcRenderer} = require('electron');
const ipc = ipcRenderer;

function encode_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

function decode_b64(str) {
    return decodeURIComponent(escape(window.atob(str)));
}