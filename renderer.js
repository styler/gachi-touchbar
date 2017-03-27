// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer} = require('electron');

ipcRenderer.on('gachi', (event, gachi) => {
    const audio = new Audio(gachi);
    audio.volume = 1;
    audio.play();
    console.log('Playing', gachi);
});