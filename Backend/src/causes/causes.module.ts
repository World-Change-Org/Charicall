import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CausesService } from './causes.service';
import { CausesController } from './causes.controller';
import { Cause } from './entities/cause.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cause])],
  controllers: [CausesController],
  providers: [CausesService],
})
export class CausesModule {}
