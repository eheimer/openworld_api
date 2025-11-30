import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from "./auth.service"
import { PlayersService } from "../players/players.service"
import { JwtService } from '@nestjs/jwt'
import { Player } from "../players/entities/player.entity"
import { Not } from 'typeorm'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { CreateBattleDto } from "../games/battles/dto/create-battle.dto"
import { CreatePlayerDto } from "../players/dto/create-player.dto"

describe('AuthService', () => {
  let service: AuthService
  let fakePlayersService: Partial<PlayersService>

  beforeEach(async () => {
    //create a fake copy of PlayersService
    fakePlayersService = {
      findOneByUsername: async (username) => Promise.resolve(null),
      findOneByEmail: async (email) => Promise.resolve(null),
      create: async (dto: CreatePlayerDto) =>
        Promise.resolve({ id: 1, username: dto.username, email: dto.email, password: dto.password } as Player),
      //create: async (username, email, password) => Promise.resolve({ id: 1, username, email, password } as Player),
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
    const user = await service.register({ username: 'eric', email: 'eric@asdf.com', password: 'asdf' })
    expect(user.password).not.toBe('asdf')
    const [salt, hash] = user.password.split('.')
    expect(salt).toBeDefined()
    await expect(user.password).toBe(`${salt}.${await service.hashPassword('asdf', salt)}`)
    expect(hash).toBeDefined()
    expect(salt.length).toBe(16)
    expect(hash.length).toBe(128)
  })

  it('should throw an error if email is in use', async () => {
    fakePlayersService.findOneByEmail = (email) =>
      Promise.resolve({ id: 1, username: 'eric', email, password: 'asdf' } as Player)
    await (expect(service.register({ username: 'eric', email: 'eric@asdf.com', password: 'asdf' })).rejects as any).toThrowError(
      'Email already in use'
    )
  })

  it('should throw if authenticate is called with invalid username', async () => {
  await (expect(service.authenticate('eric', 'asdf')).rejects as any).toThrowError('User not found')
  })

  it('throws if an invalid password is provided', async () => {
    fakePlayersService.findOneByUsername = (username) =>
      Promise.resolve({ id: 1, username, email: 'asdf@asdf.com', password: 'asdf' } as Player)
  await (expect(service.authenticate('eric', 'asdf')).rejects as any).toThrowError('Invalid password')
  })

  it('returns a user if correct password is provided', async () => {
    const password = 'asdf'
    const salt = service.makeSalt()
    const hash = await service.hashPassword(password, salt)
    fakePlayersService.findOneByUsername = (username) =>
      Promise.resolve({ id: 1, username, email: 'asdf@asdf.com', password: `${salt}.${hash}` } as Player)
    const user = await service.authenticate('eric', 'asdf')
    expect(user).toBeDefined()
  })
})
