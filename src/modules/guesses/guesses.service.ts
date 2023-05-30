import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Guess } from 'entities/guess.entity';
import { Location } from 'entities/location.entity';
import { User } from 'entities/user.entity';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { LocationsService } from '../locations/locations.service';
import { CreateGuessDto } from './dto/create-guess.dto';

@Injectable()
export class GuessesService extends AbstractService<Guess> {
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
    const guess = await this.findByLocation(locationId, user);
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

  async findByLocation(locationId: number, user: User) {
    return this.guessesRepository.findOne({
      where: { user: { id: user.id }, location: { id: locationId } },
      relations: ['location', 'user'],
    });
  }

  async findPersonalByLocation(locationId: number) {
    return this.guessesRepository.find({
      where: { location: { id: locationId } },
      relations: ['location', 'user'],
      order: { errorDistance: 'ASC' },
    });
  }
}
