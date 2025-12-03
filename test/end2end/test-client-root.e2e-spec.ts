import { INestApplication } from '@nestjs/common'
import { APIUtils } from '../api/helpers/util'
import request from 'supertest'

describe('Test Client Root Debug (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await APIUtils.createApp()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should debug / endpoint', async () => {
    const response = await request(app.getHttpServer()).get('/')
    console.log('Status:', response.status)
    console.log('Content-Type:', response.headers['content-type'])
    console.log('Body preview:', response.text?.substring(0, 100))
  })

  it('should debug /index.html endpoint', async () => {
    const response = await request(app.getHttpServer()).get('/index.html')
    console.log('Status:', response.status)
    console.log('Content-Type:', response.headers['content-type'])
    console.log('Body preview:', response.text?.substring(0, 100))
  })
})
