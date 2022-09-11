import { PartialType } from '@nestjs/swagger';
import { CreateSpellbookDto } from './create-spellbook.dto';

export class UpdateSpellbookDto extends PartialType(CreateSpellbookDto) {}
