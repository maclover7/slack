var AppMenu = function(app) {
  this.app = app
  this.menuTemplate = require('./menuTemplate.js')
}

AppMenu.prototype.build = function() {
  that = this;

  this.menuTemplate[0].submenu.push(
    { type: 'separator' },

    {
      label: 'Manage Teams',
      click() {
        that.app.displayWindow('home')
      }
    }
  )

  if (process.platform === 'darwin') {
    var name = require('electron').app.getName();

    this.menuTemplate.unshift({
      label: name,
      submenu: [
        {
          label: 'Hide ' + name,
          accelerator: 'Command+H',
          role: 'hide'
        },

        {
          label: 'Hide Others',
          accelerator: 'Command+Alt+H',
          role: 'hideothers'
        },

        {
          label: 'Show All',
          role: 'unhide'
        },

        { type: 'separator' },

        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click() {
            require('electron').app.quit()
          }
        }
      ]
    })

    // Window menu
    this.menuTemplate[3].submenu.push(
      { type: 'separator' },

      {
        label: 'Bring All to Front',
        role: 'front'
      }
    )
  }

  return this.menuTemplate
}

module.exports = AppMenu
