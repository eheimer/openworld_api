import { Test, TestingModule } from '@nestjs/testing';
import { ConditionsController } from './conditions.controller';
import { ConditionsService } from './conditions.service';

describe('ConditionsController', () => {
  let controller: ConditionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConditionsController],
      providers: [ConditionsService],
    }).compile();

    controller = module.get<ConditionsController>(ConditionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
