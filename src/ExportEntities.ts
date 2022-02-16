import path from 'path'
import fs from 'fs'

const inputFile = path.join(__dirname, '..', 'build/typedoc.json')

const typesContent = fs.readFileSync(inputFile, 'utf8')
const types = JSON.parse(typesContent)

const outputPath = path.join(__dirname, '..', 'build/UnityModels')
fs.mkdir(outputPath, { recursive: true }, (err) => {
  if (err) throw err
})

const excludeModels = ['EntityBase']

const buildtime = new Date()
const buildstring = `${buildtime.toLocaleDateString()} ${buildtime.toLocaleTimeString()}`
const header = `// Autogenerated ${buildstring}`

const namespace = 'Openworld.Models'

const toStringMethod = `public override string ToString(){
      return UnityEngine.JsonUtility.ToJson (this, true);
    }`

const entityTemplate = `${header}
using System;

namespace ${namespace}
{
  [Serializable]
  public class {modelName} {extends}
  {
{fields}

    ${toStringMethod} 
  }
}`

const fieldTemplate = `    public {type} {fieldname};`

/**
 * @description Convert data types from typescript to c#
 *
 * @param type the typescript data type to convert
 * @returns the equivalent c# data type
 */
function getTypeString(type) {
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
        console.log('union type: ' + type.types.map((x) => x.name).join('|'))
        ret = '<undetermined union>'
      }
      break
    default:
      ret = undefined
      break
  }
  if (!ret) {
    console.log(`undefined for ${type.name}`)
  }
  return ret
}

function getFlattenedExtends(branch: any, fullMap: any) {
  let extend = []

  if (branch.extendedTypes) {
    for (const item in branch.extendedTypes) {
      const ext = branch.extendedTypes[item]
      if (ext.type == 'reference' && !excludeModels.includes(ext.name)) {
        extend.push(ext.name)
        if ((ext.name as string).startsWith('i')) {
          extend = [...extend, ...getFlattenedExtends(fullMap.interfaces[ext.name], fullMap)]
        } else {
          extend = [...extend, ...getFlattenedExtends(fullMap.models[ext.name], fullMap)]
        }
      }
    }
  }
  return extend
}

function getObjectsOfKindFromEach(branch: any, kind: string) {
  let ret = {}
  for (const item in branch.children) {
    const childItem = branch.children[item]
    const children = getObjectsOfKind(childItem, kind)
    ret = { ...ret, ...children }
  }
  return ret
}

function getObjectsOfKind(branch: any, kind: string) {
  const ret = {}
  for (const item in branch.children) {
    const child = branch.children[item]
    if (child.kindString == kind) {
      ret[child.name] = child
    }
  }
  return ret
}

function getColumns(branch: any) {
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

const modules = { children: getObjectsOfKind(types, 'Module') }

const typeMap = {
  interfaces: getObjectsOfKindFromEach(modules, 'Interface'),
  models: getObjectsOfKindFromEach(modules, 'Class')
}

for (const modelName in typeMap.models) {
  if (!excludeModels.includes(modelName)) {
    const model = typeMap.models[modelName]
    model.flattenedExtends = getFlattenedExtends(model, typeMap)
    model.columns = getColumns(model)
    const fields = []
    for (const fieldName in model.columns) {
      const type = model.columns[fieldName]
      fields.push(fieldTemplate.replace('{type}', type).replace('{fieldname}', fieldName))
    }
    const output = entityTemplate
      .replace('{modelName}', modelName)
      .replace('{extends}', model.flattenedExtends.length > 0 ? `: ${model.flattenedExtends.join(',')}` : '')
      .replace('{fields}', fields.join('\n'))
    if (output.includes('undefined')) {
      console.log(output)
    }
    fs.writeFile(path.join(outputPath, `${modelName}.cs`), output, (err) => {
      if (err) throw err
    })
  }
}
