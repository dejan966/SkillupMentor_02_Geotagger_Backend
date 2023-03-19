import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Guess } from 'src/entities/guess.entity';
import { Location } from 'src/entities/location.entity';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { CreateGuessDto } from './dto/create-guess.dto';

@Injectable()
export class GuessesService extends AbstractService {
  constructor(
    @InjectRepository(Guess)
    private readonly guessesRepository:Repository<Guess>,
  ){
    super(guessesRepository)
  }

  async create(createGuessDto: CreateGuessDto) {
    const newGuess = this.guessesRepository.create(createGuessDto);
    return this.guessesRepository.save(newGuess);
  }
}