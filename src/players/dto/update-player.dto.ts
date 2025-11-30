import { PartialType } from '@nestjs/swagger'
import { CreatePlayerDto } from "./create-player.dto"

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {}

(globalThis as any).UpdatePlayerDto = UpdatePlayerDto
