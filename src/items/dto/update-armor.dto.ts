import { PartialType } from '@nestjs/swagger';
import { CreateArmorDto } from './create-armor.dto';

export class UpdateArmorDto extends PartialType(CreateArmorDto) {}
