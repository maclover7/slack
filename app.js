var App = function(electron) {
  this.electron = electron
  // Module to create native browser window.
  this.BrowserWindow = electron.BrowserWindow
  this.configPath = electron.app.getPath('userData') + '/maclover7-slack.json'

  this.teams = {}
  this.windows = {}
  let activeWindow
}

App.prototype.boot = function() {
  // Load in teams configuration
  this._loadConfiguration()

  // Create the browser window.
  homeWindow = new this.BrowserWindow({ width: 800, height: 600 })
  homeWindow.loadURL(`file://${__dirname}/index.html`)
  homeWindow.hide()
  this.windows['home'] = homeWindow
  this.displayWindow('home')
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

App.prototype._loadConfiguration = function() {
  baseConfig = {
    teams: {}
  }

  var fs = require('fs')

  if (fs.existsSync(this.configPath)) {
    var contents = fs.readFileSync(this.configPath, 'utf8')
    this.teams = JSON.parse(contents).teams
  } else {
    fs.writeFile(this.configPath, JSON.stringify(baseConfig), function(err) {
      if (err) {
        return console.log(err)
      }

      console.log("Created configuration file and wrote base configuration.")
    })

    this.teams = {}
  }
}

module.exports = App
