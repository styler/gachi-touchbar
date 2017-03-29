const {app, BrowserWindow, TouchBar, nativeImage, ipcMain} = require('electron')

const fs = require('fs');
const url = require('url');
const path = require('path');
const _ = require('lodash');

const {TouchBarLabel, TouchBarButton, TouchBarSpacer, TouchBarGroup} = TouchBar

const menuItems = [];
const audio = {};
const icons = {
  babyface: nativeImage.createFromPath('./assets/babyface.png'),
  billy: nativeImage.createFromPath('./assets/BillyH.png'),
  brother: nativeImage.createFromPath('./assets/Brother.png'),
  Kazuya: nativeImage.createFromPath('./assets/Kazuya.png'),
  markw: nativeImage.createFromPath('./assets/MarkW.png'),
  ripped: nativeImage.createFromPath('./assets/Ripped.png'),
  slave: nativeImage.createFromPath('./assets/Slave.png'),
  unripped: nativeImage.createFromPath('./assets/Unripped.png'),
  van: nativeImage.createFromPath('./assets/VanD.png')
};

_.each(icons, (image, name) => {
  fs.readdir(path.join(__dirname, 'assets', name), (err, sounds) => {
    audio[name] = sounds;
  });
  const button = new TouchBarButton({
    label: name,
    backgroundColor: randomColor(),
    icon: image.resize({
      width: 40,
      height: 40
    }),
    click: () => {
      const gachi = _.sample(audio[button.label]);
      window.webContents.send('gachi', path.join(__dirname, 'assets', button.label, gachi));
    }
  });

  menuItems.push(button)
});

function randomColor() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}

const touchBar = new TouchBar(menuItems)

app.once('ready', () => {
  window = new BrowserWindow({
    frame: false,
    titleBarStyle: 'hidden-inset',
    width: 400,
    height: 300,
  })

  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  window.setTouchBar(touchBar)
});