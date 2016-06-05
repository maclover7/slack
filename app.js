var App = function(electron) {
  this.electron = electron
  // Module to create native browser window.
  this.BrowserWindow = electron.BrowserWindow

  this.windows = {}
  let activeWindow
}

App.prototype.boot = function() {
  // Create the browser window.
  mainWindow = new this.BrowserWindow({ width: 800, height: 600 })
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.hide()
  this.windows['main'] = mainWindow
  this.displayWindow('main')
}

App.prototype.displayWindow = function(name) {
  newWindow = this.windows[name]
  activeWindow = newWindow

  newWindow.show()
  newWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  activeWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    activeWindow = null
  })
}

module.exports = App
