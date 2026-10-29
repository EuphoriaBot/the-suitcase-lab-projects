import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  getSqliteSnapshot: () => ipcRenderer.invoke('database:get-snapshot'),

  getSqliteWriteStatus: () => ipcRenderer.invoke('database:get-write-status'),

  createSqliteBackup: () => ipcRenderer.invoke('database:create-backup'),

  restoreSqliteBackup: () => ipcRenderer.invoke('database:restore-backup'),

  saveSqliteArcanist: (payload: unknown, existingId?: string) =>
    ipcRenderer.invoke('database:save-arcanist', payload, existingId),

  deleteSqliteArcanist: (id: string) => ipcRenderer.invoke('database:delete-arcanist', id),

  saveSqliteStatusEffect: (payload: unknown, existingId?: string) =>
    ipcRenderer.invoke('database:save-status-effect', payload, existingId),

  deleteSqliteStatusEffect: (id: string) => ipcRenderer.invoke('database:delete-status-effect', id)
}

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
