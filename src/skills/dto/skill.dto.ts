import { Expose } from 'class-transformer'

export class SkillDto {
  @Expose() id: number
  @Expose() name: string
  @Expose() description: string
}

