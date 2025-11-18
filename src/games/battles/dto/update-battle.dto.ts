import { PartialType } from '@nestjs/swagger'
import { CreateBattleDto } from "./create-battle.dto.js"

export class UpdateBattleDto extends PartialType(CreateBattleDto) {}

(globalThis as any).UpdateBattleDto = UpdateBattleDto
