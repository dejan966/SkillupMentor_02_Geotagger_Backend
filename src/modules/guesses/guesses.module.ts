import { Module } from '@nestjs/common';
import { GuessesService } from './guesses.service';
import { GuessesController } from './guesses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guess } from 'entities/guess.entity';
import { LocationsService } from '../locations/locations.service';
import { Location } from 'entities/location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guess]),
    TypeOrmModule.forFeature([Location]),
  ],
  controllers: [GuessesController],
  providers: [GuessesService, LocationsService],
  exports: [GuessesService]
})
export class GuessesModule {}
