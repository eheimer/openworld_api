import { PartialType } from '@nestjs/swagger';
import { CreateWeaponDto } from './create-weapon.dto';

export class UpdateWeaponDto extends PartialType(CreateWeaponDto) {}
