import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from 'entities/location.entity';
import Logging from 'library/Logging';
import { IsNull, Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { User } from 'entities/user.entity';

@Injectable()
export class LocationsService extends AbstractService {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
  ) {
    super(locationsRepository);
  }

  async create(createLocationDto: CreateLocationDto, user:User) {
    const newLocation = this.locationsRepository.create({
      ...createLocationDto,
      user
    });
    return this.locationsRepository.save(newLocation);
  }

  async findLocations(){
    return this.locationsRepository.find({where:{guesses:{errorDistance:IsNull()}}});
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    const location = await this.findById(id);
    try {
      for (const key in location) {
        if (updateLocationDto[key] !== undefined)
          location[key] = updateLocationDto[key];
      }
      return this.locationsRepository.save(location);
    } catch (error) {
      Logging.log(error);
      throw new NotFoundException(
        'Something went wrong while updating the data.',
      );
    }
  }

  async updateLocationImageId(id: number, location_img: string) {
    const location = await this.findById(id);
    if (location_img === location.image_url) {
      throw new BadRequestException('Images have to be different.');
    }
    location.image_url = location_img;
    return this.locationsRepository.save(location);
  }
}
