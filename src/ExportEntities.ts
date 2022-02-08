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

const baseModelName = 'BaseModel'
const namespace = 'Openworld.Models'

const baseModel = `${header}
using System;

namespace ${namespace}
{
	[Serializable]
	public class ${baseModelName}
	{
    public string id;
    public string createdAt;
    public string updatedAt;

		public override string ToString(){
			return UnityEngine.JsonUtility.ToJson (this, true);
		}
	}
}`
fs.writeFile(path.join(outputPath, 'BaseModel.cs'), baseModel, (err) => {
  if (err) throw err
})

const entityTemplate = `${header}
using System;
{usings}

namespace Openworld.Models
{
  [Serializable]
  public class {modelName}: ${baseModelName}
  {
{fields}
  }
}`

const fieldTemplate = `    public {type} {fieldname};`

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

for (const item in types.children) {
  const topChild = types.children[item]
  if (topChild.kindString == 'Module') {
    for (const childItem in topChild.children) {
      const child = topChild.children[childItem]
      if (child.kindString == 'Class') {
        const className = child.name
        if (excludeModels.includes(className)) {
          continue
        }
        const fields: string[] = []
        let constructor

        for (const item in child.children) {
          const member = child.children[item]
          if (member.kindString == 'Property') {
            fields.push(fieldTemplate.replace('{type}', getTypeString(member.type)).replace('{fieldname}', member.name))
          } else if (member.kindString !== 'Constructor' && member.kindString != 'Method') {
            console.log(`unhandled member kind: ${member.kindString} on ${child.name}`)
          }
        }

        const output = entityTemplate
          .replace('{usings}', '')
          .replace('{modelName}', className)
          .replace('{fields}', fields.join('\n'))
        if (output.includes('undefined')) {
          console.log(output)
        }
        fs.writeFile(path.join(outputPath, `${className}.cs`), output, (err) => {
          if (err) throw err
        })
      } else if (child.kindString != 'Reference' || child.name != 'default') {
        console.log(`unhandled child kind: ${child.kindString} on ${topChild.name}`)
      }
    }
  } else {
    console.log(`unhandled base kind: ${topChild.kindString} on ${topChild.name}`)
  }
}
