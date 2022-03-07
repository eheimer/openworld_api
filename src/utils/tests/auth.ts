import jestOpenAPI from 'jest-openapi'
import axios from 'axios'
import config from '../../config'
import path from 'path'
import RegisterRequest from '../../api/dto/request/RegisterRequest'
import parser from '@apidevtools/swagger-parser'

export default abstract class AuthInitializer {
  static token: string
  static player: string
  static api: any

  static getAuthHeader() {
    return { headers: { Authorization: `Bearer ${this.token}` } }
  }

  static async initJestOpenAPI() {
    if (!this.api) {
      this.api = await parser.validate(path.join(__dirname, '../../..', 'config/openapi.yaml'))
      jestOpenAPI(this.api)
    }
  }

  static async setUp() {
    await this.initJestOpenAPI()
    if (!this.token || !this.player) {
      //register a user (this may fail if it's not the first test, but it doesn't matter)
      try {
        const registerdata = new RegisterRequest({ email: 'erictest@heimerman.org', name: 'eric', password: 'eric' })
        await axios.post(`http://localhost:${config.port}/api/v1/players`, registerdata)
      } catch (err) {
        null
      }
      //login, get a token and playerId
      const logindata = { email: 'erictest@heimerman.org', password: 'eric' }
      const res = await axios.post(`http://localhost:${config.port}/api/v1/login`, logindata)
      this.token = res.data.token
      this.player = res.data.player
    }
  }
}
