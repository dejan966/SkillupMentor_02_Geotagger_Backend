import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from 'entities/location.entity';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { User } from 'entities/user.entity';

@Injectable()
export class LocationsService extends AbstractService<Location> {
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

  async findCurrUserLocations(id:number){
    return this.locationsRepository.find({where:{user:{id}}, relations:['guesses', 'user']});
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
