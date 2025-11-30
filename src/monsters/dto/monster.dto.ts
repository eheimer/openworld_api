import { Expose } from 'class-transformer'

export class MonsterDto {
  @Expose() id: number
  @Expose() name: string
}

