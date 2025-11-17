import { Module } from '@nestjs/common'
import { SkillsService } from "./skills.service.js"
import { SkillsController } from "./skills.controller.js"
import { TypeOrmModule } from '@nestjs/typeorm'
import { Skill } from "./entities/skill.entity.js"

@Module({
  imports: [TypeOrmModule.forFeature([Skill])],
  controllers: [SkillsController],
  providers: [SkillsService]
})
export class SkillsModule {}

(globalThis as any).SkillsModule = SkillsModule
