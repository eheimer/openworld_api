import { Module } from '@nestjs/common'
import { SkillsService } from "./skills.service.js"
import { SkillsController } from "./skills.controller.js"
import { TypeOrmModule } from '@nestjs/typeorm'
import { Skill } from "./entities/skill.entity.js"
import { getEntity, registerEntity } from "../entityRegistry.js"

@Module({
  imports: [TypeOrmModule.forFeature([Skill])],
  controllers: [SkillsController],
  providers: [SkillsService]
})
export class SkillsModule {}

registerEntity('SkillsModule', SkillsModule)
