import { IsArray, IsNotEmpty, IsNumber } from 'class-validator'

export class BattleDamageDto {
  @IsArray()
  monsters: number[]
  @IsArray()
  characters: number[]
  @IsNotEmpty()
  @IsNumber()
  damageType: number
  @IsNotEmpty()
  @IsNumber()
  damageAmt: number
}

(globalThis as any).BattleDamageDto = BattleDamageDto
