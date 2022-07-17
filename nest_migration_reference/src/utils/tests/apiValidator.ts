import jestOpenAPI from 'jest-openapi'
import path from 'path'
import parser from '@apidevtools/swagger-parser'

export default abstract class APIValidator {
  static api: any

  static async init() {
    if (!APIValidator.api) {
      APIValidator.api = await parser.validate(path.join(__dirname, '../../..', 'config/openapi.yaml'))
      jestOpenAPI(this.api)
    }
  }
}
