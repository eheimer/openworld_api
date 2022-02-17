import path from 'path'
import fs from 'fs'
import YAML from 'yamljs'

const inputFile = path.join(__dirname, '..', 'config/openapi.yml')
const outputPath = path.join(__dirname, 'api/dto')
const jsonFilePath = path.join(__dirname, '..', 'build')
fs.mkdir(outputPath, { recursive: true }, (err) => {
  if (err) throw err
})

const apidef = YAML.load(inputFile)
fs.mkdir(jsonFilePath, { recursive: true }, (err) => {
  if (err) throw err
})
fs.writeFile(path.join(jsonFilePath, `api.json`), JSON.stringify(apidef), (err) => {
  if (err) throw err
})
const buildtime = new Date()
const buildstring = `${buildtime.toLocaleDateString()} ${buildtime.toLocaleTimeString()}`
const header = `// Autogenerated ${buildstring}`

//loop through components.requestBodies and create <name>Request.ts models
for (const request in apidef.components.requestBodies) {
  const className = `${request}Request`
  const entity = makeEntity(
    header,
    className,
    apidef.components.requestBodies[request].content['application/json'].schema
  )
  fs.writeFile(path.join(outputPath, `${className}.ts`), entity, (err) => {
    if (err) throw err
  })
}
//loop through components.schemas and create <name>.ts models
for (const schema in apidef.components.schemas) {
  const className = `${schema}`
  const entity = makeEntity(header, className, apidef.components.schemas[schema])
  // fs.writeFile(path.join(outputPath, `${className}.ts`), entity, (err) => {
  //   if (err) throw err
  // })
  // console.log(entity)
}

function makeEntity(header: string, className: string, schema: any) {
  //need to be able to handle:
  //  - allOf - one idea is to make the object inherit from the referenced objects
  //  - $ref - the dto object will contain all of the fields of the referenced object
  //  - oneOf - I think split these into two endpoints, getPlayer and getPlayerDetail for example
  //  - array - both top-level response arrays and array properties
  //  - enum - good luck
  const fieldNames = []
  const fields = {}
  // "name":"type"
  const properties = schema.properties
  for (const fieldName in properties) {
    fieldNames.push(fieldName)
    fields[fieldName] = getType(properties[fieldName])
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
  if (fieldNames.length > 0) {
    const entityContent = `${header}
import { Entity } from 'typeorm'

@Entity()
export class ${className} {
  constructor(item: any) {
    const { ${fieldList} } = item

    ${fieldSetList}
  }

  ${fieldDefList}
}

export default ${className}
`

    return entityContent
  } else {
    console.log(`${className} has no properties`)
  }
}

function getType(item: any) {
  if (item.type == 'array') {
    return `${item.items.type}[]`
  }
  return item.type
}

// const fieldTemplate = `    public {type} {fieldname};`

// /**
//  * @description Convert data types from typescript to c#
//  *
//  * @param type the typescript data type to convert
//  * @returns the equivalent c# data type
//  */
// function getTypeString(type) {
//   const typeMap = {
//     uuid: 'string',
//     datetime: 'string',
//     string: 'string',
//     number: 'int',
//     Date: 'DateTime',
//     boolean: 'bool'
//   }

//   if (type.type == 'array') {
//     // return typeMap[type.elementType.name] + '[]'
//     return getTypeString(type.elementType) + '[]'
//   }
//   let unionString
//   let ret
//   switch (type.type) {
//     case 'intrinsic':
//       ret = typeMap[type.name]
//       break
//     case 'reference':
//       ret = typeMap[type.name] || type.name
//       break
//     case 'union':
//       //get the least specific type
//       unionString = type.types.map((x) => x.name).join('|')
//       if (unionString == 'string|number' || unionString == 'number|string') {
//         ret = typeMap.string
//       } else {
//         console.log('union type: ' + type.types.map((x) => x.name).join('|'))
//         ret = '<undetermined union>'
//       }
//       break
//     default:
//       ret = undefined
//       break
//   }
//   if (!ret) {
//     console.log(`undefined for ${type.name}`)
//   }
//   return ret
// }

// function getFlattenedExtends(branch: any, fullMap: any) {
//   let extend = []

//   if (branch.extendedTypes) {
//     for (const item in branch.extendedTypes) {
//       const ext = branch.extendedTypes[item]
//       if (ext.type == 'reference' && !excludeModels.includes(ext.name)) {
//         extend.push(ext.name)
//         if ((ext.name as string).startsWith('i')) {
//           extend = [...extend, ...getFlattenedExtends(fullMap.interfaces[ext.name], fullMap)]
//         } else {
//           extend = [...extend, ...getFlattenedExtends(fullMap.models[ext.name], fullMap)]
//         }
//       }
//     }
//   }
//   return extend
// }

// function getObjectsOfKindFromEach(branch: any, kind: string) {
//   let ret = {}
//   for (const item in branch.children) {
//     const childItem = branch.children[item]
//     const children = getObjectsOfKind(childItem, kind)
//     ret = { ...ret, ...children }
//   }
//   return ret
// }

// function getObjectsOfKind(branch: any, kind: string) {
//   const ret = {}
//   for (const item in branch.children) {
//     const child = branch.children[item]
//     if (child.kindString == kind) {
//       ret[child.name] = child
//     }
//   }
//   return ret
// }

// function getColumns(branch: any) {
//   const rawColumns = getObjectsOfKind(branch, 'Property')
//   const columns = {}
//   for (const item in rawColumns) {
//     const field = rawColumns[item]
//     if (!field.inheritedFrom) {
//       columns[field.name] = getTypeString(field.type)
//     }
//   }
//   return columns
// }

// const modules = { children: getObjectsOfKind(types, 'Module') }

// const typeMap = {
//   interfaces: getObjectsOfKindFromEach(modules, 'Interface'),
//   models: getObjectsOfKindFromEach(modules, 'Class')
// }

// for (const modelName in typeMap.models) {
//   if (!excludeModels.includes(modelName)) {
//     const model = typeMap.models[modelName]
//     model.flattenedExtends = getFlattenedExtends(model, typeMap)
//     model.columns = getColumns(model)
//     const fields = []
//     for (const fieldName in model.columns) {
//       const type = model.columns[fieldName]
//       fields.push(fieldTemplate.replace('{type}', type).replace('{fieldname}', fieldName))
//     }
//     const output = entityTemplate
//       .replace('{modelName}', modelName)
//       .replace('{extends}', model.flattenedExtends.length > 0 ? ` : ${model.flattenedExtends.join(',')}` : '')
//       .replace('{fields}', fields.join('\n'))
//     if (output.includes('undefined')) {
//       console.log(output)
//     }
//     fs.writeFile(path.join(outputPath, `${modelName}.cs`), output, (err) => {
//       if (err) throw err
//     })
//   }
// }
