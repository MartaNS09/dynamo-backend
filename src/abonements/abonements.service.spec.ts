import { Test, TestingModule } from '@nestjs/testing';
import { AbonementsService } from './abonements.service';

describe('AbonementsService', () => {
  let service: AbonementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AbonementsService],
    }).compile();

    service = module.get<AbonementsService>(AbonementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
