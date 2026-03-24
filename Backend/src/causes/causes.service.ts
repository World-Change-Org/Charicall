import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cause, CauseStatus } from './entities/cause.entity';

@Injectable()
export class CausesService {
  constructor(
    @InjectRepository(Cause)
    private causesRepository: Repository<Cause>,
  ) {}

  async closeCause(id: string): Promise<Cause> {
    const cause = await this.causesRepository.findOne({ where: { id } });
    if (!cause) {
      throw new NotFoundException(`Cause with ID ${id} not found`);
    }

    if (cause.status === CauseStatus.CLOSED) {
      throw new BadRequestException(`Cause with ID ${id} is already closed`);
    }

    cause.status = CauseStatus.CLOSED;
    return this.causesRepository.save(cause);
  }
}
