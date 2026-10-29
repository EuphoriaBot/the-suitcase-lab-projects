import { BrowserWindow, ipcMain, type IpcMainInvokeEvent } from 'electron'

import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { is } from '@electron-toolkit/utils'

import { readSqliteSnapshot } from './sqliteRead'

import {
  saveSqliteArcanist,
  deleteSqliteArcanist,
  saveSqliteStatusEffect,
  deleteSqliteStatusEffect
} from './sqliteCrud'

function assertTrustedSender(event: IpcMainInvokeEvent): void {
  const senderWindow = BrowserWindow.fromWebContents(event.sender)

  if (!senderWindow || event.senderFrame !== senderWindow.webContents.mainFrame) {
    throw new Error('Unauthorized SQLite IPC request.')
  }

  const senderUrl = event.senderFrame.url
  const developmentUrl = process.env['ELECTRON_RENDERER_URL']

  if (is.dev && developmentUrl) {
    if (new URL(senderUrl).origin !== new URL(developmentUrl).origin) {
      throw new Error('Untrusted renderer origin.')
    }

    return
  }

  const expectedUrl = pathToFileURL(join(__dirname, '../renderer/index.html'))

  const receivedUrl = new URL(senderUrl)

  if (receivedUrl.protocol !== 'file:' || receivedUrl.pathname !== expectedUrl.pathname) {
    throw new Error('Untrusted renderer file.')
  }
}

function isWriteEnabled(): boolean {
  return process.env['SUITCASE_SQLITE_WRITE_ENABLED'] !== 'NO'
}

function assertWriteEnabled(): void {
  if (!isWriteEnabled()) {
    throw new Error('SQLite write operations are disabled.')
  }
}

function requirePayloadFields(value: unknown, label: string, requiredFields: string[]): void {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`)
  }

  const record = value as Record<string, unknown>

  for (const field of requiredFields) {
    if (!Object.prototype.hasOwnProperty.call(record, field)) {
      throw new Error(`${label} is missing the required field: ${field}`)
    }
  }
}

function requireId(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('A valid record ID is required.')
  }

  return value
}

function optionalId(value: unknown): string | undefined {
  if (value === undefined) {
    return undefined
  }

  return requireId(value)
}

export function registerSqliteIpc(): void {
  ipcMain.handle('database:get-snapshot', (event: IpcMainInvokeEvent) => {
    assertTrustedSender(event)
    return readSqliteSnapshot()
  })

  ipcMain.handle('database:get-write-status', (event: IpcMainInvokeEvent) => {
    assertTrustedSender(event)

    return {
      enabled: isWriteEnabled()
    }
  })

  ipcMain.handle(
    'database:save-arcanist',
    (event: IpcMainInvokeEvent, payload: unknown, existingId?: unknown) => {
      assertTrustedSender(event)
      assertWriteEnabled()

      requirePayloadFields(payload, 'Arcanist', [
        'name',
        'image',
        'afflatus',
        'damageType',
        'roles',
        'mechanics',
        'tags',
        'notes',
        'skills',
        'portray',
        'relatedStatusEffects'
      ])

      return saveSqliteArcanist(payload, optionalId(existingId))
    }
  )

  ipcMain.handle('database:delete-arcanist', (event: IpcMainInvokeEvent, id: unknown) => {
    assertTrustedSender(event)
    assertWriteEnabled()

    deleteSqliteArcanist(requireId(id))
  })

  ipcMain.handle(
    'database:save-status-effect',
    (event: IpcMainInvokeEvent, payload: unknown, existingId?: unknown) => {
      assertTrustedSender(event)
      assertWriteEnabled()

      requirePayloadFields(payload, 'Status Effect', [
        'name',
        'description',
        'effect',
        'duration',
        'stackable',
        'relatedArcanists',
        'tags',
        'notes'
      ])

      return saveSqliteStatusEffect(payload, optionalId(existingId))
    }
  )

  ipcMain.handle('database:delete-status-effect', (event: IpcMainInvokeEvent, id: unknown) => {
    assertTrustedSender(event)
    assertWriteEnabled()

    deleteSqliteStatusEffect(requireId(id))
  })
}
