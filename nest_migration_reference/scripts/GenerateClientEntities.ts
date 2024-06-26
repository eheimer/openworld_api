import path from 'path'
import fs from 'fs'
import logger from '../../src/utils/logger'
import * as GENERATOR from './util/ClientGenerator'
import { buildStandardHeader } from './util/CommonGenerator'

const serverRoot = path.join(__dirname, '../..')
const inputFile = path.join(serverRoot, 'build/typedoc.json')
const typesContent = fs.readFileSync(inputFile, 'utf8')
const types = JSON.parse(typesContent)
const outputPath = path.join(serverRoot, 'build/UnityModels')

// make sure output directory exists
fs.mkdir(outputPath, { recursive: true }, (err) => {
  if (err) throw err
})

const header = buildStandardHeader('GenerateClientEntities', false)

const modules = { children: GENERATOR.getObjectsOfKind(types, 'Module') }

const typeMap = {
  models: GENERATOR.getObjectsOfKindFromEach(modules, 'Class'),
  enums: GENERATOR.getObjectsOfKindFromEach(modules, 'Enumeration')
}

for (const model of typeMap.models) {
  const output = GENERATOR.makeClientEntity(header, model.name, model)
  writeFile(model.name, output)
}

for (const e of typeMap.enums) {
  const output = GENERATOR.makeClientEnumEntity(header, e.name, e)
  writeFile(e.name, output)
}

function writeFile(name: string, output: string) {
  const outFile = path.join(outputPath, `${name}.cs`)
  fs.writeFileSync(outFile, output)
  logger.info(`File written: ${outFile}`)
}
