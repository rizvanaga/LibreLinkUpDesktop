/* eslint global-require: off, no-console: off, promise/always-return: off */
import path from "path"
import { app, BrowserWindow, ipcMain, shell } from "electron"
// import { autoUpdater } from "electron-updater"
// import log from "electron-log"
import MenuBuilder from "./menu"
import { resolveHtmlPath } from "./util"
import { WindowStateManager, WindowState } from './windowState';
import { registerWindowHandlers, destroyWindowHandlers } from "./windowHandler";
import { registerLogoutHandler, destroyLogoutHandler } from "./logoutHandler";
import { registerRefreshHandler, destroyRefreshHandler } from "./refreshHandler";
// class AppUpdater {
//   constructor() {
//     log.transports.file.level = 'info'
//     autoUpdater.logger = log
//     autoUpdater.checkForUpdatesAndNotify()
//   }
// }

let mainWindow: BrowserWindow | null = null
let miniWindow: BrowserWindow | null = null

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'

if (isDebug) {
  require('electron-debug')()
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = ['REACT_DEVELOPER_TOOLS']

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log)
}

const createWindow = async () => {
  if (isDebug) {
    await installExtensions()
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets')

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths)
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  })

  mainWindow.isPrimary = true;

  // 👉 save window state
  const defaultWindowState: WindowState = {
    width: 1024,
    height: 728,
  };
  const windowStateManager = new WindowStateManager('main', defaultWindowState);
  windowStateManager.manage(mainWindow);

  mainWindow.loadURL(resolveHtmlPath('index.html'))

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize()
    } else {
      mainWindow.show()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  const menuBuilder = new MenuBuilder(mainWindow)
  menuBuilder.buildMenu()

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url)
    return { action: 'deny' }
  })

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater()
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  destroyWindowHandlers();
  destroyLogoutHandler();
  destroyRefreshHandler();
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app
  .whenReady()
  .then(() => {
    createWindow()
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow()
    })
  })
  .catch(console.log)

// Utils that calls invoke
ipcMain.handle('ipc-open-file', async (event, ...args) => {
  const appPath = app.isPackaged
    ? app.getAppPath()
    : path.join(__dirname, '..')

  const filePath = path.join(appPath, '..', 'assets', 'resources', ...args)
  shell.openPath(filePath)
})


registerWindowHandlers();
registerLogoutHandler();
registerRefreshHandler();
