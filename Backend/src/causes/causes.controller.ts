import { Controller, Post, Param } from '@nestjs/common';
import { CausesService } from './causes.service';
import { Cause } from './entities/cause.entity';

@Controller('api/causes')
export class CausesController {
  constructor(private readonly causesService: CausesService) {}

  @Post(':id/close')
  async closeCause(@Param('id') id: string): Promise<Cause> {
    return this.causesService.closeCause(id);
  }
}
