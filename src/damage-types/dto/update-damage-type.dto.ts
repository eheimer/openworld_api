import { PartialType } from '@nestjs/swagger';
import { CreateDamageTypeDto } from './create-damage-type.dto';

export class UpdateDamageTypeDto extends PartialType(CreateDamageTypeDto) {}
