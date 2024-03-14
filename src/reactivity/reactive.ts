import { readonlyHandler, reativeHandler } from './baseHandlers'

export function reactive(row) {
    return createActiveObject(row, reativeHandler)
}

export function readonly(row) {
    return createActiveObject(row, readonlyHandler)
}

function createActiveObject(row, baseHandlers) {
    return new Proxy(row, baseHandlers)
}

