const {app, BrowserWindow, TouchBar, nativeImage, ipcMain} = require('electron')

const fs = require('fs');
const url = require('url');
const path = require('path');

const {TouchBarLabel, TouchBarButton, TouchBarSpacer, TouchBarGroup} = TouchBar
const gachiFolder = fs.readdirSync('gachi');

const gachiIcon = nativeImage.createFromPath('./assets/billy.png');

const gachiButton = new TouchBarButton({
  icon: gachiIcon,
  click: () => {
    const gachi = gachiFolder[Math.floor(Math.random() * gachiFolder.length)];
    window.webContents.send('gachi', path.join(__dirname, 'gachi', gachi));
  }
});

let window


const menuItems = [gachiButton];

gachiFolder.forEach(gachi => {
  const item = new TouchBarButton({
    label: gachi.replace('.mp3', ''),
    // icon: gachiIcon,
    click: () => {
      window.webContents.send('gachi', path.join(__dirname, 'gachi', gachi));
      console.log('Trying to play', gachi);
    }
  });

  menuItems.push(item);
});

const touchBar = new TouchBar(menuItems)

app.once('ready', () => {
  window = new BrowserWindow({
    frame: false,
    titleBarStyle: 'hidden-inset',
    width: 800,
    height: 800,
    backgroundColor: '#000'
  })

  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  window.webContents.openDevTools()
  window.setTouchBar(touchBar)
});