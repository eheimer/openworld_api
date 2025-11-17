import { Expose } from 'class-transformer'
import { DTO } from "../../decorators/dto-property.decorator.js"
import { RaceSkillDto } from "./raceskill.dto.js"

export class RaceDto {
  @Expose() id: number
  @Expose() name: string
  @Expose() description: string
  @Expose() @DTO(RaceSkillDto) skills: RaceSkillDto[]
}

(globalThis as any).RaceDto = RaceDto
