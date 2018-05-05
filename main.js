// toggles
const showLabel = false
const chooseRandomly = true;
const randomBackgroundColor = false;


const {app, BrowserWindow, TouchBar, nativeImage, ipcMain} = require('electron')

const fs = require('fs');
const url = require('url');
const path = require('path');
const _ = require('lodash');

const {TouchBarLabel, TouchBarButton, TouchBarSpacer, TouchBarGroup} = TouchBar

const thumbnailSize = 30;
const menuItemLimit = 8;
const defaultBackgroundColor = '#263238';

const menuItems = [];
const audio = {};
const icons = {
  styleer: nativeImage.createFromPath('./assets/styleer.png'),
  yoav: nativeImage.createFromPath('./assets/yoav.png'),
  billyH: nativeImage.createFromPath('./assets/BillyH.png'),
  brother: nativeImage.createFromPath('./assets/Brother.png'),
  Kazuya: nativeImage.createFromPath('./assets/Kazuya.png'),
  markw: nativeImage.createFromPath('./assets/MarkW.png'),
  ripped: nativeImage.createFromPath('./assets/Ripped.png'),
  slave: nativeImage.createFromPath('./assets/Slave.png'),
  unripped: nativeImage.createFromPath('./assets/Unripped.png'),
  vanD: nativeImage.createFromPath('./assets/VanD.png')
};

boys = Object.assign({}, icons);
if (chooseRandomly) {
  while (Object.keys(boys).length > menuItemLimit) {
    objKeys = Object.keys(boys);
    rnd = parseInt(Math.random() * objKeys.length,10);
    delete boys[objKeys[rnd]];
  }
}

_.each(boys, (image, name) => {
  fs.readdir(path.join(__dirname, 'assets', name), (err, sounds) => {
    audio[name] = sounds;
  });

  if (showLabel) {
    labelText = name;
  } else {
    labelText = '';
  }
  if (randomBackgroundColor) {
    bgc = randomColor();
  } else {
    bgc = defaultBackgroundColor;
  }

  const button = new TouchBarButton({
    label: labelText,
    backgroundColor: bgc,
    iconPosition: 'overlay',
    icon: image.resize({
      width: thumbnailSize / image.height * image.width,
      height: thumbnailSize
    }),
    click: () => {
      const gachi = _.sample(audio[name]);
      window.webContents.send('gachi', path.join(__dirname, 'assets', name, gachi));
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
    titleBarStyle: 'hiddenInset',
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