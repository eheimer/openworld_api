import path from 'path'
import logger from '../../utils/logger'
import fs from 'fs'
import YAML from 'yamljs'

export function getAPIDefinition(file: string, output = false, outputPath = '', filename = 'api.json') {
  const def = YAML.load(file)
  if (output) {
    fs.mkdirSync(outputPath, { recursive: true })
    const outputFile = path.join(outputPath, filename)
    fs.writeFileSync(outputFile, JSON.stringify(def))
    logger.info(`API definition JSON written to file: ${outputFile}`)
  }
  return def
}
/**
 * @decription convert a yaml type to TypeScript data type
 * @param item the yaml type definition
 * @returns associated TypeScript data type
 */
export function getTSDataType(item: any) {
  /**
   * { type: 'number', array: true }
   * { type: 'string' }
   * { type: 'Date' }
   * { type: 'ClassName', ref: true, array: true }
   * { type: 'ClassName', ref: true }
   */
  const stringFormatTypeMap = {
    'date-time': 'Date',
    email: 'string'
  }
  if (item.type == 'array') {
    if (item.items.type) {
      return { array: true, type: item.items.type }
    } else if (item.items.$ref) {
      return {
        array: true,
        type: item.items.$ref.split('/').pop()
      }
    }
  }
  if (item.$ref) {
    return { type: item.$ref.split('/').pop(), ref: true }
  }
  if (item.type == 'string' && item.format) {
    return { type: stringFormatTypeMap[item.format] }
  }
  return { type: item.type }
}

/**
 * @description Generate a TypeScript module from the API definition
 * @param header A header to place on the file
 * @param className Name of the entity
 * @param map Complete map of all entities to use for references
 * @returns The module content as a string
 */
export function makeTSEntity(header: string, className: string, map: any) {
  const schema = map[className].schema

  //Redirect if the entity is an Enum
  if (schema.enum) {
    return makeTSEnumEntity(header, className, map)
  }

  const fieldNames = []
  const fields = {}
  const properties = schema.properties
  const imports = []

  for (const fieldName in properties) {
    fieldNames.push(fieldName)
    const type = getTSDataType(properties[fieldName])
    fields[fieldName] = type.type
    if (type.ref) imports.push(makeTSEntityImport(className, type.type, map))
    if (type.array) fields[fieldName] += '[]'
  }

  let extend = ''
  if (schema.allOf) {
    if (schema.allOf.length > 1) {
      logger.error(`Schema ${className} conflict: multiple inheritance`)
    } else {
      extend = schema.allOf[0].$ref.split('/').pop()
      imports.push(makeTSEntityImport(className, extend, map))
    }
  }
  const fieldList = fieldNames.join(', ')
  const fieldSetList = fieldNames
    .map((value) => {
      return `this.${value} = ${value}`
    })
    .join('\n    ')
  const fieldDefList = fieldNames
    .map((value) => {
      return `${value}: ${fields[value]}`
    })
    .join('\n  ')
  if (fieldNames.length == 0) {
    if (schema.oneOf) {
      logger.warn('need to process oneOf')
    }
  }
  const uniqueImports = Array.from(new Set(imports))
  const entityContent = `${header}
import { Entity } from 'typeorm'${
    uniqueImports.length
      ? `
${uniqueImports.join('\n')}`
      : ``
  }
${
  schema.description
    ? `
/**
 * @description - ${schema.description}
 */`
    : ``
}
@Entity()
export class ${className}${extend.length ? ` extends ${extend}` : ``} {
  constructor(item: any) {${extend.length ? `\n    super(item)` : ``}${
    fieldList.length ? `\n    const { ${fieldList} } = item` : ``
  }${fieldSetList.length ? `\n    ${fieldSetList}` : ''}
  }${fieldDefList.length ? `\n  ${fieldDefList}` : ''}
}

export default ${className}
`

  return entityContent
}

/**
 * @description Generate a TypeScript enum module from the API definition
 * @param header A header to place on the file
 * @param className Name of the enum
 * @param map Complete map of all entities to use for references
 * @returns The enum module content as a string
 */
export function makeTSEnumEntity(header: string, className: string, map: any) {
  const schema = map[className].schema
  return `${header}
${
  schema.description
    ? `
/**
 * @description - ${schema.description}
 */`
    : ``
}
export enum ${className} {
  ${map[className].schema.enum.join(',\n  ')}
}

export default ${className}
`
}

/**
 * @description generate an import line for a TypeScript entity module
 * @param className the class that the import is applied to
 * @param importClassName the class to be imported
 * @param map the complete map of entities
 * @returns the import line to be applied to the class
 */
export function makeTSEntityImport(className: string, importClassName: string, map: any) {
  const thisClass = map[className]
  const target = map[importClassName]
  if (thisClass.path! == target.path!) {
    return `import ${importClassName} from './${importClassName}'`
  }
  return `import ${importClassName} from '${path.join(
    thisClass.path ? '..' : '.',
    target.path ? target.path : '',
    importClassName
  )}'`
}

/**
 * @description generate a class map from the api definition
 * @param def the api definition
 * @returns a map of all classes in the api definition
 */
export function buildEntityMapFromAPI(
  def: any,
  pathMap: any,
  output = false,
  outputPath = '',
  filename = 'classmap.json'
) {
  const map = {}
  for (const request in def.components.requestBodies) {
    const className = `${request}Request`
    map[className] = {
      path: pathMap.Request ? pathMap.Request.subdir : undefined,
      schema: def.components.requestBodies[request].content['application/json'].schema
    }
  }
  for (const schema in def.components.schemas) {
    const className = `${schema}`
    map[className] = { schema: def.components.schemas[schema] }
    if (className.endsWith('Response')) {
      map[className].path = pathMap.Response ? pathMap.Response.subdir : undefined
    }
  }
  if (output) {
    const outputFile = path.join(outputPath, filename)
    fs.writeFileSync(outputFile, JSON.stringify(def))
    logger.info(`Class map JSON written to file: ${outputFile}`)
  }
  return map
}
