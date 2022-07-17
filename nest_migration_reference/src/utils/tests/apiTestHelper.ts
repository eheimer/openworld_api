import axios from 'axios'
import config from '../../config'
import RegisterRequest from '../../api/dto/request/RegisterRequest'
import LoginRequest from '../../api/dto/request/LoginRequest'
import faker from 'faker'
import APIValidator from './apiValidator'

export default class APITestHelper {
  urlPrefix = '/api/v1'
  email = faker.internet.email()
  password = faker.random.word()
  token: string
  player: string

  makeAuthHeader(): any {
    return { headers: { Authorization: `Bearer ${this.token}` } }
  }

  makeUrl(path: string): string {
    if (!path.startsWith(this.urlPrefix)) {
      if (!path.startsWith('/')) {
        path = `/${path}`
      }
      path = `${this.urlPrefix}${path}`
    }
    return `http://localhost:${config.port}${path}`
  }

  async authenticate() {
    await APIValidator.init()
    //register a random player
    const registerdata = new RegisterRequest({
      email: this.email,
      name: faker.name.firstName(),
      password: this.password
    })
    await this.post('/players', registerdata, true)
    //login, get a token and playerId
    const logindata = new LoginRequest({ email: this.email, password: this.password })
    const res = await this.post('/login', logindata, true)
    this.token = res.data.token
    this.player = res.data.player
  }

  async post(url: string, data: any, noauth = false) {
    return await axios.post(this.makeUrl(url), data, noauth ? {} : this.makeAuthHeader())
  }

  async patch(url: string, data: any, noauth = false) {
    return await axios.patch(this.makeUrl(url), data, noauth ? {} : this.makeAuthHeader())
  }

  async get(url: string, noauth = false) {
    return await axios.get(this.makeUrl(url), noauth ? {} : this.makeAuthHeader())
  }

  async delete(url: string, noauth = false) {
    return await axios.delete(this.makeUrl(url), noauth ? {} : this.makeAuthHeader())
  }
}
