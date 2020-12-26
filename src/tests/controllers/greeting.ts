import request from 'supertest'
import { Express } from 'express-serve-static-core'

import { createServer } from '../../utils/server'
import DB from '../../utils/db'
import user from '../../api/services/user'
import { UserFactory } from '../../api/factories/UserFactory'

let server: Express
const factory: UserFactory = new UserFactory()

beforeAll(async () => {
    await DB.init()
    server = await createServer()
})

afterAll(async () => {
})

describe('GET /hello', () => {
    it('should return 200 & valid response if request param list is empty', async done => {
        request(server)
            .get(`/api/v1/hello`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body).toMatchObject({ 'message': 'Hello, stranger!' })
                done()
            })
    })

    it('should return 200 and valid response if name param is set', async done => {
        request(server)
            .get(`/api/v1/hello?name=Test%20Name`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body).toMatchObject({ 'message': 'Hello, Test Name!' })
                done()
            })
    })

    it('should return 400 & valid error response if name param is empty', async done => {
        request(server)
            .get(`/api/v1/hello?name=`)
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body).toMatchObject({
                    'error': {
                        type: 'request_validation',
                        message: expect.stringMatching(/Empty.*\'name\'/),
                        errors: expect.anything()
                    }
                })
                done()
            })
    })
})

describe('GET /goodbye', () => {
    it('should return 200 & valid response to authorization with fakeToken request', async done => {
        const dummy = await factory.createDummy();
        const authToken = await user.createAuthToken(dummy.id)
        request(server)
            .get(`/api/v1/goodbye`)
            .set('Authorization', `Bearer ${authToken.token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err)
                expect(res.body).toMatchObject({ 'message': `Goodbye, ${dummy.id}!` })
                done()
            })
    })

    it('should return 401 & valid error response to invalid authorization token', async done => {
        request(server)
            .get(`/api/v1/goodbye`)
            .set('Authorization', 'Bearer invalidFakeToken')
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function (err, res) {
                if (err) return done(err)
                expect(res.body).toMatchObject({ error: { type: 'unauthorized', message: 'Authentication Failed' } })
                done()
            })
    })

    it('should return 401 & valid error response if authorization header field is missing', async done => {
        request(server)
            .get(`/api/v1/goodbye`)
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function (err, res) {
                if (err) return done(err)
                expect(res.body).toMatchObject({
                    'error': {
                        type: 'request_validation',
                        message: 'Authorization header required',
                        errors: expect.anything()
                    }
                })
                done()
            })
    })
})