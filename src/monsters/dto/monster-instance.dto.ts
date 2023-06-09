import { Expose, Transform } from 'class-transformer'

export class MonsterInstanceDto {
  @Expose()
  name: string

  //this is a ratio of the monster's current hp to its orig hp
  @Transform(({ obj }) => obj.hp / obj.orighp)
  @Expose()
  hp: number
}
