import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from 'src/entities/location.entity';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationsService extends AbstractService {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>
  ){
    super(locationsRepository)
  }

  /* async create(createLocationDto: CreateLocationDto) {
    const newLocation = this.locationsRepository.create(createLocationDto);
    return this.locationsRepository.save(newLocation);
  } */
}
