import path from 'path'
import fs from 'fs'
import logger from '../../utils/logger'
import { APIMethod } from 'types'

/**
 * @description generate a controller map from the api definition
 * @param def the api definition
 * @returns a map of all controller methods in the api definition
 */
export function buildControllerMapFromAPI(
  def: any,
  output = false,
  outputPath = '',
  filename = 'controllermap.json'
): any {
  const map = {}
  const controllersIgnore = ['static', 'testing']
  const verbs = ['post', 'get', 'patch', 'delete']
  // first find all of the controllers
  for (const path in def.paths) {
    const parameters = def.paths[path].parameters ?? []
    for (const verb of verbs) {
      if (def.paths[path][verb]) {
        const method: APIMethod = def.paths[path][verb]
        //parameters
        if (method.parameters && method.parameters.length > 0) {
          method.parameters = [...parameters, ...method.parameters]
        } else {
          method.parameters = parameters
        }
        method.parameters = [...parameters, ...(method.parameters ?? [])]
        //requestObject
        if (method.requestBody && method.requestBody.$ref) {
          method.requestObject = method.requestBody.$ref.split('/').pop() + 'Request'
        }
        //responseObject
        const ignoreResponseObjects = ['IdCollectionResponse']
        if (method.responses[200] && method.responses[200].$ref) {
          const resp = method.responses[200].$ref.split('/').pop() + 'Response'
          if (!ignoreResponseObjects.includes(resp)) method.responseObject = resp
        }
        //controller
        if (method.tags && !controllersIgnore.includes(method.tags[0])) {
          if (!map[method.tags[0]]) {
            map[method.tags[0]] = { methods: {} }
          }
          const controller = map[method.tags[0]]
          controller.methods[method.operationId] = method
        }
      }
    }
  }
  if (output) {
    const outputFile = path.join(outputPath, filename)
    fs.writeFileSync(outputFile, JSON.stringify(map))
  }
  return map
}

export function addImports(imports: string[], toAdd: string[]): string[] {
  for (const imp of toAdd) {
    if (!imports.includes(imp)) imports.push(imp)
  }
  return imports
}

export function makeController(controller: any): string {
  return `import * as express from 'express'
import * as respond from '../../utils/express'
import { makeRoutePath } from '../../utils/server'
`
}

export function makeControllerMethod(method: APIMethod): { imports: string[]; method: string } {
  const methodName = method.operationId
  const methodRows = [
    `/**
 * ${method.summary}${
      method.description
        ? `
 * @description ${method.description}`
        : ''
    }
 */`
  ]
  methodRows.push(makeMethodSignature(methodName))
  const imports = []
  if (method.requestObject) {
    methodRows.push(`  const request = new ${method.requestObject}(req.body)`)
    imports.push(`import ${method.requestObject} from '../dto/request/${method.requestObject}'`)
  }
  if (method.parameters.length > 0) {
    methodRows.push(
      `  const { ${Array.from(
        new Set(
          method.parameters.map((item) => {
            return item.name
          })
        )
      ).join(', ')} } = req.params`
    )
  }
  methodRows.push(`  try {
    /* process the request and produce a response */`)
  if (method.responseObject) {
    imports.push(`import ${method.responseObject} from '../dto/response/${method.responseObject}'`)
    methodRows.push(`    const response = new ${method.responseObject}({})`)
  }
  imports.push(`import FailResponse from '../dto/response/FailResponse'`)
  methodRows.push(`    // handle the following responses:`)
  for (const code in method.responses) {
    switch (code) {
      case '200':
        methodRows.push(`    // ${code}: Success
    return respond.OK(res, ${method.responseObject})`)
        break
      case '201':
        methodRows.push(`    // ${code}: Success Location Response
    const path = ''
    // generate the location path, for example:
    // const path = makeRoutePath('getGame', { gameId: (resp as any).gameId })
    return respond.CREATED(res, path)`)
        break
      case '204':
        methodRows.push(`    // ${code}: Success, no content
    return respond.NO_CONTENT(res)`)
        break
      case '404':
        methodRows.push(`    // ${code}: Resource not found
    // return respond.NOT_FOUND(res)`)
        break
      case '500':
        // this is handled by default for every method in the catch block
        break
      default:
        logger.warn('Method Generator: unhandled response type: ' + code)
        break
    }
  }
  methodRows.push(`  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }`)

  methodRows.push('}')

  return { imports, method: methodRows.join('\n') }
}

export function getControllerImports(controllerRows: string[]): string[] {
  const importRows = []
  for (const row of controllerRows) {
    if (row.startsWith('import ')) importRows.push(row)
  }

  return importRows
}

export function makeMethodSignature(methodName: string): string {
  return `export async function ${methodName}(req: express.Request, res: express.Response): Promise<void> {`
}

export function matchMethodSignature(test: string, methodName = ''): RegExpMatchArray {
  const methodNameTest = methodName.length > 0 ? methodName : '.*?'
  const sigRegex = new RegExp(`.* function (${methodNameTest})\\(.*`)
  return test.match(sigRegex)
}

export function getControllerMethods(controllerRows: string[]): any {
  const methods = {}
  for (const row of controllerRows) {
    const regexMatch = matchMethodSignature(row)
    if (regexMatch) {
      methods[regexMatch[1]] = getControllerMethod(regexMatch[1], controllerRows)
    }
  }
  return methods
}

export function getControllerMethod(methodName: string, controllerRows: string[]): string[] {
  const methodRows = []
  let foundMethod = false
  for (const row of controllerRows) {
    if (!foundMethod) {
      const match = matchMethodSignature(row, methodName)
      if (match) {
        foundMethod = true
        methodRows.push(row)
      }
    } else {
      methodRows.push(row)
      // search for the ^}$ at the end of the method
      const match = row.match(/^}$/)
      if (match) {
        break
      }
    }
  }
  return methodRows
}
