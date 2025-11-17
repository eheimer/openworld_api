import { PartialType } from '@nestjs/swagger'
import { CreateDamageTypeDto } from "./create-damage-type.dto.js"

export class UpdateDamageTypeDto extends PartialType(CreateDamageTypeDto) {}

(globalThis as any).UpdateDamageTypeDto = UpdateDamageTypeDto
