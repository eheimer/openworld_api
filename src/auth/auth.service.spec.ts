import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { PlayersService } from '../players/players.service'
import { JwtService } from '@nestjs/jwt'
import { Player } from '../players/player.entity'
import { Not } from 'typeorm'
import { BadRequestException, NotFoundException } from '@nestjs/common'

describe('AuthService', () => {
  let service: AuthService
  let fakePlayersService: Partial<PlayersService>

  beforeEach(async () => {
    //create a fake copy of PlayersService
    fakePlayersService = {
      findByUsername: async (username) => Promise.resolve(null),
      findByEmail: async (email) => Promise.resolve(null),
      create: async (username, email, password) => Promise.resolve({ id: 1, username, email, password } as Player),
      update: async (id, data: Partial<Player>) => Promise.resolve({ id, ...data } as Player)
    }
    const fakeJwtService: Partial<JwtService> = {
      sign: (payload) => 'randomstring'
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PlayersService,
          useValue: fakePlayersService
        },
        { provide: JwtService, useValue: fakeJwtService }
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should salt and hash password', async () => {
    const user = await service.register('eric', 'eric@asdf.com', 'asdf')
    expect(user.password).not.toBe('asdf')
    const [salt, hash] = user.password.split('.')
    expect(salt).toBeDefined()
    await expect(user.password).toBe(`${salt}.${await service.hashPassword('asdf', salt)}`)
    expect(hash).toBeDefined()
    expect(salt.length).toBe(16)
    expect(hash.length).toBe(128)
  })

  it('should throw an error if email is in use', async () => {
    fakePlayersService.findByEmail = (email) =>
      Promise.resolve({ id: 1, username: 'eric', email, password: 'asdf' } as Player)
    await expect(service.register('eric', 'eric@asdf.com', 'asdf')).rejects.toThrowError('Email already in use')
  })

  it('should throw if authenticate is called with invalid username', async () => {
    await expect(service.authenticate('eric', 'asdf')).rejects.toThrowError('User not found')
  })

  it('throws if an invalid password is provided', async () => {
    fakePlayersService.findByUsername = (username) =>
      Promise.resolve({ id: 1, username, email: 'asdf@asdf.com', password: 'asdf' } as Player)
    await expect(service.authenticate('eric', 'asdf')).rejects.toThrowError('Invalid password')
  })

  it('returns a user if correct password is provided', async () => {
    const password = 'asdf'
    const salt = service.makeSalt()
    const hash = await service.hashPassword(password, salt)
    fakePlayersService.findByUsername = (username) =>
      Promise.resolve({ id: 1, username, email: 'asdf@asdf.com', password: `${salt}.${hash}` } as Player)
    const user = await service.authenticate('eric', 'asdf')
    expect(user).toBeDefined()
  })
})
