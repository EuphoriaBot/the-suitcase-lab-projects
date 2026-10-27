import { contextBridge, ipcRenderer } from 'electron'

import { electronAPI } from '@electron-toolkit/preload'

// ==========================================
// CUSTOM RENDERER API
// ==========================================

const api = {
  getSqliteSnapshot: () => ipcRenderer.invoke('database:get-snapshot')
}

// ==========================================
// EXPOSE API TO REACT
// ==========================================

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)

    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('[Preload] Unable to expose API:', error)
  }
} else {
  Object.assign(window, {
    electron: electronAPI,
    api
  })
}
