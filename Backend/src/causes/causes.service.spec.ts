import { Test, TestingModule } from '@nestjs/testing';
import { CausesService } from './causes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cause } from './entities/cause.entity';

describe('CausesService', () => {
  let service: CausesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CausesService,
        {
          provide: getRepositoryToken(Cause),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CausesService>(CausesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
