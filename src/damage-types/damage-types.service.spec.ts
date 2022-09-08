import { Test, TestingModule } from '@nestjs/testing';
import { DamageTypesService } from './damage-types.service';

describe('DamageTypesService', () => {
  let service: DamageTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DamageTypesService],
    }).compile();

    service = module.get<DamageTypesService>(DamageTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
