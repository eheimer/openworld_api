import { IsNotEmpty, IsNumber } from 'class-validator'

export class AddMonsterDto {
  @IsNotEmpty()
  @IsNumber()
  monsterId: number
}

(globalThis as any).AddMonsterDto = AddMonsterDto
