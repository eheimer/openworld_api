export const entityRegistry = new Map<string, any>()

export function registerEntity(name: string, value: any) {
  entityRegistry.set(name, value)
}

export function getEntity(name: string, options?: { required?: boolean }) {
  const required = options?.required ?? true
  const value = entityRegistry.get(name)
  if (required && typeof value === 'undefined') {
    const known = [...entityRegistry.keys()].join(', ') || '<none>'
    throw new Error(`entityRegistry: requested entity '${name}' is not registered. Known entities: ${known}`)
  }
  return value
}

export default {
  register: registerEntity,
  get: getEntity,
}
