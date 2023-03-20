import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from 'src/entities/location.entity';
import Logging from 'src/library/Logging';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService extends AbstractService {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>
  ){
    super(locationsRepository)
  }

/*   async create(createLocationDto: CreateLocationDto) {
    const newLocation = this.locationsRepository.create(createLocationDto);
    return this.locationsRepository.save(newLocation);
  } */

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    const location = await this.findById(id);
    try {
      for (const key in location) {
        if (updateLocationDto[key]) location[key] = updateLocationDto[key];
      }
      return this.locationsRepository.save(location);
    } catch (error) {
      Logging.log(error)
      throw new NotFoundException('Something went wrong while updating the data.');
    }
  }
}
