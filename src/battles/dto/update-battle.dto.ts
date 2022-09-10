import { PartialType } from '@nestjs/swagger';
import { CreateBattleDto } from './create-battle.dto';

export class UpdateBattleDto extends PartialType(CreateBattleDto) {}
