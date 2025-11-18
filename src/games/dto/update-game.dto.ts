import { PartialType } from '@nestjs/swagger'
import { CreateGameDto } from "./create-game.dto.js"

export class UpdateGameDto extends PartialType(CreateGameDto) {}

(globalThis as any).UpdateGameDto = UpdateGameDto
