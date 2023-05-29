import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Guess } from 'entities/guess.entity';
import { Location } from 'entities/location.entity';
import { User } from 'entities/user.entity';
import Logging from 'library/Logging';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { LocationsService } from '../locations/locations.service';
import { CreateGuessDto } from './dto/create-guess.dto';
import { PaginatedResult } from 'interfaces/paginated-result.interface';

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

  async paginatePersonalBest(page = 1, user: User): Promise<PaginatedResult> {
    const take = 9;
    try {
      const [data, total] = await this.guessesRepository.findAndCount({
        where: { user: { id: user.id } },
        relations: ['location', 'user'],
        order: { errorDistance: 'ASC' },
        take,
        skip: (page - 1) * take,
      });

      return {
        data: data,
        meta: {
          total,
          page,
          last_page: Math.ceil(total / take),
        },
      };
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while searching for a paginated elements.',
      );
    }
  }
}
