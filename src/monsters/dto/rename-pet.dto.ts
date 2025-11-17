import { IsNotEmpty, IsString } from 'class-validator'

export class RenamePetDto {
  @IsString()
  @IsNotEmpty()
  name: string
}

(globalThis as any).RenamePetDto = RenamePetDto
