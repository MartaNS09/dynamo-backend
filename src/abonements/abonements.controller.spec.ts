import { Test, TestingModule } from '@nestjs/testing';
import { AbonementsController } from './abonements.controller';

describe('AbonementsController', () => {
  let controller: AbonementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AbonementsController],
    }).compile();

    controller = module.get<AbonementsController>(AbonementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
