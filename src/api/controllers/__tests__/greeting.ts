import request from 'supertest'
import { Express } from 'express-serve-static-core'

import db from '@openworld/utils/db'
import { createServer } from '@openworld/utils/server'
import { createDummyAndAuthorize} from '@openworld/tests/user'
import { create } from 'domain'

let server: Express

beforeAll(async () => {
    await db.open()
    server = await createServer()
})

afterAll(async () => {
    await db.close()
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
        const dummy = await createDummyAndAuthorize()
        request(server)
            .get(`/api/v1/goodbye`)
            .set('Authorization', `Bearer ${dummy.token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err)
                expect(res.body).toMatchObject({ 'message': `Goodbye, ${dummy.userId}!` })
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