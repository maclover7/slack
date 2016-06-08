var AppMenu = require('./appmenu.js')

var App = function(electron) {
  this.electron = electron
  // Module to create native browser window.
  this.BrowserWindow = electron.BrowserWindow
  this.Menu = electron.Menu

  this.configPath = electron.app.getPath('userData') + '/maclover7-slack.json'
  this.teams = []
  this.windows = {}

  this.activeWindow = null
}

App.prototype.boot = function() {
  // Load in teams configuration
  this._loadConfiguration()
  this._setupHomePage()
  this._setupWindows()
  this._setupMenu()
  this.displayWindow('home')
}

App.prototype.displayWindow = function(name) {
  newWindow = this.windows[name]

  if (this.activeWindow) {
    this.activeWindow.hide()
  }

  newWindow.show()
  newWindow.webContents.executeJavaScript("var MacGapImpersonator = function() {}")
  notifier = "MacGapImpersonator.prototype.growl = new (function() { "+
    "this.notify = function(args) { " +
      "n = new Notification(args.title, { body: args.content }); " +
      "n.onclick = new(function() { window.focus(); args.onclick }); " +
    "}})"
  newWindow.webContents.executeJavaScript(notifier)
  newWindow.webContents.executeJavaScript("window.macgap = new MacGapImpersonator()")
  this.activeWindow = newWindow

  that = this
  // Emitted when the window is closed.
  this.activeWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    that.activeWindow = null
  })
}

App.prototype._loadConfiguration = function() {
  baseConfig = {
    teams: []
  }

  var fs = require('fs')

  if (fs.existsSync(this.configPath)) {
    var contents = fs.readFileSync(this.configPath, 'utf8')

    if (contents) {
      this.teams = JSON.parse(contents).teams
    } else {
      this.teams = []
    }
  } else {
    fs.writeFile(this.configPath, JSON.stringify(baseConfig), function(err) {
      if (err) {
        return console.log(err)
      }

      console.log("Created configuration file and wrote base configuration.")
    })

    this.teams = []
  }
}

App.prototype._setupHomePage = function() {
  // Create the browser window
  homeWindow = new this.BrowserWindow({ width: 800, height: 600 })
  homeWindow.loadURL(`file://${__dirname}/index.html`)
  homeWindow.hide()
  this.windows['home'] = homeWindow
  homeWindow.hide()
}

App.prototype._setupMenu = function() {
  var appMenu = new AppMenu(this)
  var appMenu = appMenu.build()

  appMenu[1].submenu.push(
    { type: 'separator' }
  )

  this._loadConfiguration()
  that = this

  this.teams.forEach(function(team) {
    appMenu[1].submenu.push({
      label: team,
      click() {
        that.displayWindow(team)
      }
    })
  })

  var menu = this.Menu.buildFromTemplate(appMenu)
  this.Menu.setApplicationMenu(menu)
}

App.prototype._setupTeamWindow = function(team) {
  // Create the browser window.
  teamWindow = new this.BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false
    }
  })

  teamWindow.loadURL(`https://${team}.slack.com`)
  teamWindow.show()
  teamWindow.hide()
  this.windows[team] = teamWindow
}

App.prototype._setupWindows = function() {
  that = this

  this.teams.forEach(function(team) {
    that._setupTeamWindow(team)
  })
}

module.exports = App
