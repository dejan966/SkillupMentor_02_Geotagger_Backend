import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Guess } from 'src/entities/guess.entity';
import { Location } from 'src/entities/location.entity';
import { User } from 'src/entities/user.entity';
import Logging from 'src/library/Logging';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { CreateGuessDto } from './dto/create-guess.dto';
import { UpdateGuessDto } from './dto/update-guess.dto';

@Injectable()
export class GuessesService extends AbstractService {
  constructor(
    @InjectRepository(Guess)
    private readonly guessesRepository:Repository<Guess>,
  ){
    super(guessesRepository)
  }

  async create(createGuessDto: CreateGuessDto, user:User) {
    const newGuess = this.guessesRepository.create({...createGuessDto, user});
    return this.guessesRepository.save(newGuess);
  }

  async update(id:number, updateGuessDto: UpdateGuessDto){
    const guess = await this.findById(id);
    try {
      for (const key in guess) {
        if (updateGuessDto[key]) guess[key] = updateGuessDto[key];
      }
      return this.guessesRepository.save(guess);
    } catch (error) {
      Logging.log(error)
      throw new NotFoundException('Something went wrong while updating the data.');
    }
  }
}