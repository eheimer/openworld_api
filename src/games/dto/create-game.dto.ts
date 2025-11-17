import { IsNotEmpty, IsString } from 'class-validator'

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  name: string
}

(globalThis as any).CreateGameDto = CreateGameDto
