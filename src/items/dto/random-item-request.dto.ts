import { IsIn, IsOptional, IsString, Max, Min } from 'class-validator'

export class RandomItemRequestDto {
  @IsOptional()
  @IsString()
  @IsIn(['weapon', 'armor', 'jewelry'])
  itemType?: string

  @IsOptional()
  @Min(1)
  @Max(5)
  level?: number
}

