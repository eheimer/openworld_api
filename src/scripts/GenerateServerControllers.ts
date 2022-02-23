import path from 'path'
import fs from 'fs'
import logger from '../utils/logger'
import * as GENERATOR from './util/ControllerGenerator'
import { getAPIDefinition } from './util/DTOGenerator'
import { buildStandardHeader } from './util/CommonGenerator'
import { APIMethod } from '../../types/index'

const serverRoot = path.join(__dirname, '../..')
const sourcePath = path.join(serverRoot, 'src')
const apiPath = path.join(sourcePath, 'api')
const configPath = path.join(serverRoot, 'config')
const APIDefinitionFile = path.join(configPath, 'openapi.yml')
const buildPath = path.join(serverRoot, 'build')
const outputAPIJSON = false
const APIJSONOutputPath = buildPath
const outputClassMap = true
const classMapOutputPath = buildPath
const controllerOutputPath = path.join(apiPath, 'controllers')

//Make sure output directories exist
if (outputAPIJSON) {
  fs.mkdir(APIJSONOutputPath, { recursive: true }, (err) => {
    if (err) throw err
  })
}
if (outputClassMap) {
  fs.mkdir(classMapOutputPath, { recursive: true }, (err) => {
    if (err) throw err
  })
}
fs.mkdir(controllerOutputPath, { recursive: true }, (err) => {
  if (err) throw err
})

const header = buildStandardHeader('GenerateServerControllers', false)

const controllerMap = GENERATOR.buildControllerMapFromAPI(
  getAPIDefinition(APIDefinitionFile, outputAPIJSON, APIJSONOutputPath),
  outputClassMap,
  classMapOutputPath
)

for (const controllerName in controllerMap) {
  const controller = controllerMap[controllerName]
  const controllerFile = path.join(controllerOutputPath, `${controllerName}.ts`)
  if (!fs.existsSync(controllerFile)) {
    fs.writeFileSync(controllerFile, GENERATOR.makeController(controller))
  }
  const existing = fs.readFileSync(controllerFile, 'utf8')
  const existingRows: string[] = existing ? existing.split('\n') : []
  let controllerImports: string[] = existing ? GENERATOR.getControllerImports(existing.split('\n')) : []

  //chop the "import" head off the existing file
  while (existingRows.length > 0) {
    if (!existingRows[0].startsWith('import') && existingRows[0].trim() !== '') {
      break
    }
    existingRows.shift()
  }

  const existingMethods = GENERATOR.getControllerMethods(existing.split('\n'))
  const newMethods = {}
  for (const method in controller.methods as APIMethod) {
    const signature = GENERATOR.makeMethodSignature(method)
    if (existingMethods[method] && existingMethods[method][0] != signature) {
      logger.warn(`Controller method ${controllerName}.${method} exists and does not match expected signature.
    ${existingMethods[method][0]}
    ${signature}`)
    } else if (!existingMethods[method]) {
      const makeResult = GENERATOR.makeControllerMethod(controller.methods[method])
      if (makeResult.imports) {
        controllerImports = GENERATOR.addImports(controllerImports, makeResult.imports)
      }
      newMethods[method] = makeResult.method
    }
  }

  //write the file
  let output = controllerImports.join('\n') + '\n\n'
  //console.log(output)
  if (existing) {
    output += existingRows.join('\n')
  } else {
    output += '\n'
  }
  for (const method in newMethods) {
    output += '\n' + newMethods[method] + '\n'
  }

  fs.writeFileSync(path.join(controllerOutputPath, controllerName + '.ts'), output)
}
