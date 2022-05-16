import logger from '../../utils/logger'

class ModelDef {
  kindString: string
  name: string
  type: string
  extendedTypes: ModelDef[]
  children: ModelDef[]
  flattenedExtends: string[]
  columns: ColumnDef[]
}

class ColumnDef extends ModelDef {
  inheritedFrom: string
}

class EnumItemDef extends ModelDef {
  defaultValue: number
}

/**
 * @description Generate a C# module from the TypeScript definition
 * @param header A header to place on the file
 * @param className Name of the entity
 * @param map Complete map of all entities to use for references
 * @returns The module content as a string
 */
export function makeClientEntity(header: string, modelName: string, model: ModelDef): string {
  logger.debug('processing ' + modelName)
  const namespace = 'Openworld.Models'

  const entityTemplate = `${header}
using System;
using Openworld.Binding;

namespace ${namespace}
{
  public class {modelName}{extends}
  {
{fields}
  }
}`

  const fieldTemplate = `    private {type} _{fieldname};
    public {type} {fieldname} {
      get => _{fieldname};
      set => Set(ref _{fieldname}, value);
    }`

  model.flattenedExtends = getFlattenedExtends(model)
  if (model.flattenedExtends.length == 0) {
    model.flattenedExtends = ['ObservableObject']
  }
  model.columns = getEntityColumns(model)
  const fields = []
  for (const column of model.columns) {
    fields.push(
      fieldTemplate.replace(new RegExp('{type}', 'g'), column.type).replace(new RegExp('{fieldname}', 'g'), column.name)
    )
  }

  const output = entityTemplate
    .replace('{modelName}', modelName)
    .replace('{extends}', model.flattenedExtends.length > 0 ? ` : ${model.flattenedExtends.join(', ')}` : '')
    .replace('{fields}', fields.join('\n\n'))
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
export function makeClientEnumEntity(header: string, enumName: string, model: ModelDef): string {
  logger.debug('processing enum ' + enumName)
  const enumItems = getObjectsOfKind(model, 'Enumeration member') as EnumItemDef[]
  const members = []
  for (const item of enumItems) {
    members.push(`${item.name} = ${item.defaultValue}`)
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
 * @description get properties from the TypeScript module definition
 * @param branch TypeScript module definition
 * @returns collection of properties with their types
 */
export function getEntityColumns(branch: ModelDef): ColumnDef[] {
  const rawColumns = getObjectsOfKind(branch, 'Property') as ColumnDef[]
  const columns = []
  for (const field of rawColumns) {
    if (!field.inheritedFrom) {
      columns.push({ name: field.name, type: getTypeString(field.type) })
    }
  }
  return columns
}

/**
 * @description get a collection of objects that the given object extends
 * @param branch an object
 * @returns array of strings
 */
export function getFlattenedExtends(branch: ModelDef): string[] {
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
export function getObjectsOfKindFromEach(branch: any, kind: string): ModelDef[] {
  const ret = []
  for (const item in branch.children) {
    const childItem = branch.children[item]
    const children = getObjectsOfKind(childItem, kind)
    ret.push(...children)
  }
  return ret
}

/**
 * @description get matching object from each child
 * @param branch the object
 * @param kind the kindString to match
 * @returns collection of matching objects
 */
export function getObjectsOfKind(branch: ModelDef, kind: string): ModelDef[] {
  const ret = []
  for (const item in branch.children) {
    const child = branch.children[item]
    if (child.kindString == kind) {
      ret.push(child)
    }
  }
  return ret
}

/**
 * @description Convert data types from typescript to c#
 * @param type the typescript data type to convert
 * @returns the equivalent c# data type
 */
export function getTypeString(type): string {
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
