var App = function(electron) {
  this.electron = electron
  // Module to create native browser window.
  this.BrowserWindow = electron.BrowserWindow
}

App.prototype.boot = function() {
  // Create the browser window.
  mainWindow = new this.BrowserWindow({ width: 800, height: 600 })
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

module.exports = App
