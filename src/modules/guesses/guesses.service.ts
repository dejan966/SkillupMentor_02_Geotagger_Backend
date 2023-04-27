import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Guess } from 'entities/guess.entity';
import { Location } from 'entities/location.entity';
import { User } from 'entities/user.entity';
import Logging from 'library/Logging';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { LocationsService } from '../locations/locations.service';
import { CreateGuessDto } from './dto/create-guess.dto';
import { UpdateGuessDto } from './dto/update-guess.dto';

@Injectable()
export class GuessesService extends AbstractService {
  constructor(
    @InjectRepository(Guess)
    private readonly guessesRepository: Repository<Guess>,
    private readonly locationsService: LocationsService,
  ) {
    super(guessesRepository);
  }

  async createGuess(
    createGuessDto: CreateGuessDto,
    user: User,
    locationId: number,
  ) {
    const guess = await this.findByLocation(locationId);
    if (guess) {
      const errorDistance = createGuessDto.errorDistance;
      return this.update(guess.id, { errorDistance });
    }
    const location = (await this.locationsService.findById(
      locationId,
    )) as Location;
    const newGuess = await this.guessesRepository.create({
      ...createGuessDto,
      location,
      user,
    });
    return this.guessesRepository.save(newGuess);
  }

  async findByLocation(locationId: number) {
    return this.guessesRepository.findOne({
      where: { location: { id: locationId } },
      relations: ['location', 'user'],
    });
  }

  async findPersonalBest() {
    return this.guessesRepository.find({
      relations: ['location', 'user'],
      order: { errorDistance: 'DESC' },
    });
  }

  async update(id: number, updateGuessDto: UpdateGuessDto) {
    const guess = await this.findById(id);
    try {
      for (const key in guess) {
        if (updateGuessDto[key] !== undefined) guess[key] = updateGuessDto[key];
      }
      return this.guessesRepository.save(guess);
    } catch (error) {
      Logging.log(error);
      throw new NotFoundException(
        'Something went wrong while updating the data.',
      );
    }
  }
}
