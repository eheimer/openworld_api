import path from 'path'
import fs from 'fs'
import logger from '../../src/utils/logger'
import * as GENERATOR from './util/DTOGenerator'
import { buildStandardHeader } from './util/CommonGenerator'

const serverRoot = path.join(__dirname, '../..')
const sourcePath = path.join(serverRoot, 'src')
const APIDefinitionFile = path.join(serverRoot, 'config/openapi.yml')
const outputAPIJSON = true
const APIJSONOutputPath = path.join(serverRoot, 'build')
const outputClassMap = true
const classMapOutputPath = path.join(serverRoot, 'build')
const entityOutputPath = path.join(sourcePath, 'api/dto')
const entityOutputSubdirs = { Request: { subdir: 'request' }, Response: { subdir: 'response' } }

//Make sure output directories exist
fs.mkdir(entityOutputPath, { recursive: true }, (err) => {
  if (err) throw err
})
for (const key in entityOutputSubdirs) {
  const subdir = entityOutputSubdirs[key].subdir
  if (subdir) {
    const fullPath = path.join(entityOutputPath, subdir)
    fs.mkdirSync(fullPath, { recursive: true })
  }
}

const header = buildStandardHeader('GenerateServerModels', false)

const classMap = GENERATOR.buildEntityMapFromAPI(
  GENERATOR.getAPIDefinition(APIDefinitionFile, outputAPIJSON, APIJSONOutputPath),
  entityOutputSubdirs,
  outputClassMap,
  classMapOutputPath
)

for (const className in classMap) {
  const entity = GENERATOR.makeTSEntity(header, className, classMap)
  const outFile = path.join(
    entityOutputPath,
    classMap[className].path ? classMap[className].path : '',
    `${className}.ts`
  )

  //Check for entity changes.  We don't want to overwrite if the
  //only thing that has changed is the header
  let diff = true
  if (fs.existsSync(outFile)) {
    let data = fs.readFileSync(outFile, 'utf8')
    const lines = data.split('\n')
    lines.shift()
    data = lines.join('\n')
    const entityLines = entity.split('\n')
    entityLines.shift()
    const diffEntity = entityLines.join('\n')
    diff = data != diffEntity
    if (!diff) {
      logger.debug(`Object ${className} exists, contents unchanged.`)
    }
  }
  if (diff) {
    fs.writeFile(outFile, entity, (err) => {
      logger.info(`File written: ${outFile}`)
      if (err) throw err
    })
  }
}
