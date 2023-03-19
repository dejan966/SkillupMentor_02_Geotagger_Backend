import { Module } from '@nestjs/common';
import { GuessesService } from './guesses.service';
import { GuessesController } from './guesses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guess } from 'src/entities/guess.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guess])],
  controllers: [GuessesController],
  providers: [GuessesService]
})
export class GuessesModule {}
