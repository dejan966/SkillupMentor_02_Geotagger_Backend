import { Module } from '@nestjs/common';
import { GuessesService } from './guesses.service';
import { GuessesController } from './guesses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guess } from 'src/entities/guess.entity';
import { LocationsService } from '../locations/locations.service';
import { Location } from 'src/entities/location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guess]), 
    TypeOrmModule.forFeature([Location])
  ],
  controllers: [GuessesController],
  providers: [
    GuessesService, 
    LocationsService
  ],
})
export class GuessesModule {}
