import { Expose, Transform } from 'class-transformer'

export class RaceSkillDto {
  @Expose()
  @Transform(({ obj }) => obj.skill.id)
  id: number

  @Expose()
  @Transform(({ obj }) => obj.skill?.name)
  name: string

  @Expose()
  @Transform(({ obj }) => obj.skill?.description)
  description: string

  @Expose()
  level: number
}
