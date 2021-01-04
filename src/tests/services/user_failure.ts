// import jwt, {Secret, SignCallback, SignOptions} from 'jsonwebtoken'

// import user from '../../api/services/user'

// import DB from '../../utils/db'
// import { UserFactory } from '../../api/factories/UserFactory'

// const factory = new UserFactory()

// beforeAll(async () => {
//     await DB.init()
// })

// afterAll(async () => {
// })

// describe('login', () => {
//   it('should return internal_server_error if jwt.sign fails with the error', async () => {
//     (jwt.sign as any) = (payload: string | Buffer | object,
//       secretOrPrivateKey: Secret,
//       options: SignOptions,
//       callback: SignCallback) => {
//         callback(new Error('failure'), undefined)
//     }

//     const dummy = factory.makeDummy()
//     const dummydb = await factory.create(dummy)

//     await expect(user.login(dummy.email, dummy.password)).rejects.toEqual({
//       error: {type: 'internal_server_error', message: 'Internal Server Error'}
//     })
//   })
// })
