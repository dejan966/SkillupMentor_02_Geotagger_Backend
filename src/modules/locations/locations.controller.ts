import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

/*   @Post()
  async create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  } */

  @Get()
  async findAll() {
    return this.locationsService.findAll();
  }

  @Get('picture')
  async findByPicture(pic: string){
    return this.locationsService.findBy(pic)
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.locationsService.findById(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.locationsService.remove(id);
  }
}
