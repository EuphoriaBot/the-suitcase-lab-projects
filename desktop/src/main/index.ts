import { app, shell, BrowserWindow, ipcMain } from 'electron'

import { join } from 'path'

import { electronApp, optimizer, is } from '@electron-toolkit/utils'

import icon from '../../resources/icon.png?asset'

import { initializeDatabase, closeDatabase } from './database'

import { importLocalBackupFromEnvironment } from './importLocalBackup'

import { verifySqliteMigrationFromEnvironment } from './verifySqliteMigration'

import { readSqliteSnapshot } from './sqliteRead'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,

    ...(process.platform === 'linux' ? { icon } : {}),

    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function registerDatabaseHandlers(): void {
  ipcMain.handle('database:get-snapshot', (event) => {
    const senderWindow = BrowserWindow.fromWebContents(event.sender)

    if (!senderWindow || event.senderFrame !== senderWindow.webContents.mainFrame) {
      throw new Error('Unauthorized database read request.')
    }

    return readSqliteSnapshot()
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  try {
    initializeDatabase()

    try {
      importLocalBackupFromEnvironment()
    } catch (error) {
      console.error('[SQLite Import] FAILED:', error)
    }

    try {
      verifySqliteMigrationFromEnvironment()
    } catch (error) {
      console.error('[SQLite Verify] FAILED:', error)
    }
  } catch (error) {
    console.error('[SQLite] Initialization failed:', error)
  }

  registerDatabaseHandlers()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('before-quit', () => {
  closeDatabase()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
