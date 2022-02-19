import path from 'path'
import fs from 'fs'
import YAML from 'yamljs'

const inputFile = path.join(__dirname, '..', 'config/openapi.yml')
const outputPath = path.join(__dirname, 'api/dto')
const jsonFilePath = path.join(__dirname, '..', 'build')
fs.mkdir(outputPath, { recursive: true }, (err) => {
  if (err) throw err
})
fs.mkdir(path.join(outputPath, 'request'), { recursive: true }, (err) => {
  if (err) throw err
})
fs.mkdir(path.join(outputPath, 'response'), { recursive: true }, (err) => {
  if (err) throw err
})
const apidef = YAML.load(inputFile)
fs.mkdirSync(jsonFilePath, { recursive: true })
fs.writeFileSync(path.join(jsonFilePath, `api.json`), JSON.stringify(apidef))

const buildtime = new Date()
const buildstring = `${buildtime.toLocaleDateString()} ${buildtime.toLocaleTimeString()}`
const header = `// Autogenerated ${buildstring}`

const classMap = buildMap(apidef)
fs.writeFileSync(path.join(jsonFilePath, `classMap.json`), JSON.stringify(classMap))

//TODO: loop through classMap instead, which contains the schema
for (const className in classMap) {
  let entity = ''
  if (classMap[className].schema.enum) {
    entity = makeEnumEntity(header, className, classMap)
  } else {
    entity = makeEntity(header, className, classMap)
  }
  fs.writeFile(
    path.join(outputPath, classMap[className].path ? classMap[className].path : '', `${className}.ts`),
    entity,
    (err) => {
      if (err) throw err
    }
  )
}

function buildMap(def: any) {
  const map = {}
  for (const request in def.components.requestBodies) {
    const className = `${request}Request`
    map[className] = {
      path: 'request',
      schema: def.components.requestBodies[request].content['application/json'].schema
    }
  }
  for (const schema in def.components.schemas) {
    const className = `${schema}`
    map[className] = { schema: def.components.schemas[schema] }
    if (className.endsWith('Response')) {
      map[className].path = 'response'
    }
  }
  return map
}

function makeImport(className: string, importClassName: string, map: any) {
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

function makeEnumEntity(header: string, className: string, map: any) {
  return `${header}
export enum ${className} {
  ${map[className].schema.enum.join(',\n  ')}
}

export default ${className}
`
}

function makeEntity(header: string, className: string, map: any) {
  //need to be able to handle:
  //  - allOf - one idea is to make the object inherit from the referenced objects
  //  - $ref - the dto object will contain all of the fields of the referenced object
  //  - oneOf - I think split these into two endpoints, getPlayer and getPlayerDetail for example
  //  - array - both top-level response arrays and array properties
  //  - enum - good luck
  console.log(`Making ${className}`)
  const schema = map[className].schema
  const fieldNames = []
  const fields = {}
  const properties = schema.properties
  const imports = []
  for (const fieldName in properties) {
    fieldNames.push(fieldName)
    const type = getType(properties[fieldName])
    fields[fieldName] = type.type
    if (type.ref) imports.push(makeImport(className, type.type, map))
    if (type.array) fields[fieldName] += '[]'
  }

  let extend = ''
  if (schema.allOf) {
    //need to extend another class
    //need to ensure the api definition never uses allOf to extend multiple
    //  schemas since ts only supports single inheritance.  We should report
    //  it here if we encounter it
    if (schema.allOf.length > 1) {
      console.log(`Schema ${className} conflict: multiple inheritance`)
    } else {
      extend = schema.allOf[0].$ref.split('/').pop()
      imports.push(makeImport(className, extend, map))
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
      console.log('need to process oneOf')
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

@Entity()
export class ${className}${extend.length ? ` extends ${extend}` : ``} {
  constructor(item: any) {${extend.length ? `\n    super(item)` : ``}
    ${fieldList.length ? `const { ${fieldList} } = item` : ``}

    ${fieldSetList}
  }

  ${fieldDefList}
}

export default ${className}
`

  return entityContent
}

function getType(item: any) {
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