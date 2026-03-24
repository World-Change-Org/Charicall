import { Test, TestingModule } from '@nestjs/testing';
import { CausesController } from './causes.controller';
import { CausesService } from './causes.service';
import { Cause, CauseStatus } from './entities/cause.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CausesController', () => {
  let controller: CausesController;
  let service: CausesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CausesController],
      providers: [
        {
          provide: CausesService,
          useValue: {
            closeCause: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CausesController>(CausesController);
    service = module.get<CausesService>(CausesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should successfully close an active cause', async () => {
    const closedCause = new Cause();
    closedCause.id = '123';
    closedCause.status = CauseStatus.CLOSED;

    const spy = jest
      .spyOn(service, 'closeCause')
      .mockResolvedValue(closedCause);

    const result = await controller.closeCause('123');
    expect(result.status).toBe(CauseStatus.CLOSED);
    expect(spy).toHaveBeenCalledWith('123');
  });

  it('should bounce a non-existent cause closure with NotFoundException', async () => {
    jest
      .spyOn(service, 'closeCause')
      .mockRejectedValue(new NotFoundException());
    await expect(controller.closeCause('404')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should bounce closing an already-closed cause with BadRequestException', async () => {
    jest
      .spyOn(service, 'closeCause')
      .mockRejectedValue(new BadRequestException());
    await expect(controller.closeCause('123')).rejects.toThrow(
      BadRequestException,
    );
  });
});
