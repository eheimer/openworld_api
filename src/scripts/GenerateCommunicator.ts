import path from 'path'
import fs from 'fs'
import logger from '../utils/logger'
import * as GENERATOR from './util/CommunicatorGenerator'
import { getAPIDefinition } from './util/DTOGenerator'
import { buildStandardHeader } from './util/CommonGenerator'
import { buildControllerMapFromAPI } from './util/ControllerGenerator'
import { APIMethod } from '../../types/index'
import { buildRequestMap } from './util/CommunicatorGenerator'

const serverRoot = path.join(__dirname, '../..')
const configPath = path.join(serverRoot, 'config')
const APIDefinitionFile = path.join(configPath, 'openapi.yml')
const buildPath = path.join(serverRoot, 'build')
const outputAPIJSON = false
const APIJSONOutputPath = buildPath
const outputClassMap = true
const classMapOutputPath = buildPath
const outputPath = buildPath
const outFile = path.join(outputPath, 'Communicator.cs')

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
fs.mkdir(outputPath, { recursive: true }, (err) => {
  if (err) throw err
})

if (!fs.existsSync(outFile)) {
  GENERATOR.createCommunicatorFile(outFile)
}

const fileRows = fs.readFileSync(outFile, 'utf8').split('\n')

const methodHeader = buildStandardHeader('GenerateCommunicator', true)

// get server urls (prod and dev)
const api = getAPIDefinition(APIDefinitionFile, outputAPIJSON, APIJSONOutputPath)
const controllerMap = buildControllerMapFromAPI(api, outputClassMap, classMapOutputPath)
const reqMap = buildRequestMap(api)
const newMethods: string[] = []

for (const controllerName in controllerMap) {
  for (let methodName in controllerMap[controllerName].methods) {
    const method: APIMethod = controllerMap[controllerName].methods[methodName]
    methodName = methodName[0].toUpperCase() + methodName.slice(1)
    //check if methodName exists
    if (!methodNameExists(fileRows, methodName)) {
      newMethods.push(GENERATOR.makeMethod(methodHeader, methodName, method, reqMap))
    }
  }
}

logger.info(newMethods.length + ' new methods to add to communicator')
const newFileRows = []

let openBrackets = 0
let startClass = false
let inClass = false
let classBrackets = 0
let done = false

for (const row of fileRows) {
  const newBrackets = (row.match(/{/g)?.length || 0) - (row.match(/}/g)?.length || 0)
  openBrackets += newBrackets
  if (!startClass) {
    //add every row until we find the class declaration
    if (row.trim().startsWith('public class Communicator : MonoBehaviour')) {
      startClass = true
      if (row.trim().endsWith('{')) {
        inClass = true
        classBrackets = openBrackets
      }
    }
  } else if (!inClass) {
    //once we find the class declaration, make sure we have also found the open bracket
    if (newBrackets > 0) {
      inClass = true
      classBrackets = openBrackets
    }
  } else if (!done && openBrackets < classBrackets) {
    //class is closing, here's where we want to add new route methods
    newFileRows.push(...newMethods)
    done = true
  }
  newFileRows.push(row)
}

fs.writeFileSync(outFile, newFileRows.join('\n'))

function methodNameExists(rows: string[], methodName: string): boolean {
  for (const row of rows) {
    if (row.trim().startsWith(`public void ${methodName}(`)) return true
  }
  return false
}
