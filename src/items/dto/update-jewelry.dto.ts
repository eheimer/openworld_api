import { PartialType } from '@nestjs/swagger';
import { CreateJewelryDto } from './create-jewelry.dto';

export class UpdateJewelryDto extends PartialType(CreateJewelryDto) {}
