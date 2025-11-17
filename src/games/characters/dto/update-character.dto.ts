import { PartialType } from '@nestjs/swagger'
import { CreateCharacterDto } from "./create-character.dto.js"

export class UpdateCharacterDto extends PartialType(CreateCharacterDto) {}

(globalThis as any).UpdateCharacterDto = UpdateCharacterDto
