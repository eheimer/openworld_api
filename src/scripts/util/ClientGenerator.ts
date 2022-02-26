import logger from '../../utils/logger'

/**
 * @description Generate a C# module from the TypeScript definition
 * @param header A header to place on the file
 * @param className Name of the entity
 * @param map Complete map of all entities to use for references
 * @returns The module content as a string
 */
export function makeClientEntity(header: string, modelName: string, model: any) {
  logger.debug('processing ' + modelName)
  const namespace = 'Openworld.Models'

  const toStringMethod = `public override string ToString(){
      return UnityEngine.JsonUtility.ToJson (this, true);
    }`

  const entityTemplate = `${header}
using System;

namespace ${namespace}
{
  [Serializable]
  public class {modelName}{extends}
  {
{fields}

    ${toStringMethod} 
  }
}`

  const fieldTemplate = `    public {type} {fieldname};`
  model.flattenedExtends = getFlattenedExtends(model)
  model.columns = getEntityColumns(model)
  const fields = []
  for (const fieldName in model.columns) {
    const type = model.columns[fieldName]
    fields.push(fieldTemplate.replace('{type}', type).replace('{fieldname}', fieldName))
  }

  const output = entityTemplate
    .replace('{modelName}', modelName)
    .replace('{extends}', model.flattenedExtends.length > 0 ? ` : ${model.flattenedExtends.join(',')}` : '')
    .replace('{fields}', fields.join('\n'))
  if (output.includes('undefined')) {
    logger.warn(`undefined in ${modelName}: ${output}`)
  }

  return output
}

/**
 * @description Generate a c# enum module from the TypeScript definition
 * @param header A header to place on the file
 * @param className Name of the enum
 * @param map Complete map of all entities to use for references
 * @returns The enum module content as a string
 */
export function makeClientEnumEntity(header: string, enumName: string, model: any) {
  logger.debug('processing enum ' + enumName)
  const enumItems = getEnumItems(model)
  const members = []
  for (const item in enumItems) {
    members.push(`${enumItems[item]} = ${item}`)
  }

  return `${header}
namespace Openworld.Models
{
  public enum ${enumName}
  {
    ${members.join(',\n    ')}
  }
}`
}

/**
 * @description get all objects that are enums
 * @param branch the parent branch to check
 * @returns collection of enum items
 */
export function getEnumItems(branch: any) {
  const members = getObjectsOfKind(branch, 'Enumeration member')
  const items = {}
  for (const item in members) {
    const member = members[item]
    items[member.defaultValue] = member.name
  }
  return items
}

/**
 * @description get properties from the TypeScript module definition
 * @param branch TypeScript module definition
 * @returns collection of properties with their types
 */
export function getEntityColumns(branch: any) {
  const rawColumns = getObjectsOfKind(branch, 'Property')
  const columns = {}
  for (const item in rawColumns) {
    const field = rawColumns[item]
    if (!field.inheritedFrom) {
      columns[field.name] = getTypeString(field.type)
    }
  }
  return columns
}

/**
 * @description get a collection of objects that the given object extends
 * @param branch an object
 * @returns array of strings
 */
export function getFlattenedExtends(branch: any) {
  const extend = []

  if (branch.extendedTypes) {
    for (const item in branch.extendedTypes) {
      const ext = branch.extendedTypes[item]
      if (ext.type == 'reference') {
        extend.push(ext.name)
      }
    }
  }
  return extend
}

/**
 * @description get matching objects from children of each child object
 * @param branch the parent object
 * @param kind the kindString to match
 * @returns collection of matching objects
 */
export function getObjectsOfKindFromEach(branch: any, kind: string) {
  let ret = {}
  for (const item in branch.children) {
    const childItem = branch.children[item]
    const children = getObjectsOfKind(childItem, kind)
    ret = { ...ret, ...children }
  }
  return ret
}

/**
 * @description get matching object from each child
 * @param branch the object
 * @param kind the kindString to match
 * @returns collection of matching objects
 */
export function getObjectsOfKind(branch: any, kind: string) {
  const ret = {}
  for (const item in branch.children) {
    const child = branch.children[item]
    if (child.kindString == kind) {
      ret[child.name] = child
    }
  }
  return ret
}

/**
 * @description Convert data types from typescript to c#
 * @param type the typescript data type to convert
 * @returns the equivalent c# data type
 */
export function getTypeString(type) {
  const typeMap = {
    uuid: 'string',
    datetime: 'string',
    string: 'string',
    number: 'int',
    Date: 'DateTime',
    boolean: 'bool'
  }

  if (type.type == 'array') {
    // return typeMap[type.elementType.name] + '[]'
    return getTypeString(type.elementType) + '[]'
  }
  let unionString
  let ret
  switch (type.type) {
    case 'intrinsic':
      ret = typeMap[type.name]
      break
    case 'reference':
      ret = typeMap[type.name] || type.name
      break
    case 'union':
      //get the least specific type
      unionString = type.types.map((x) => x.name).join('|')
      if (unionString == 'string|number' || unionString == 'number|string') {
        ret = typeMap.string
      } else {
        logger.warn('unsupported union type: ' + type.types.map((x) => x.name).join('|'))
        ret = '<undetermined union>'
      }
      break
    default:
      ret = undefined
      break
  }
  if (!ret) {
    logger.warn(`undefined type: ${type.name}`)
  }
  return ret
}
