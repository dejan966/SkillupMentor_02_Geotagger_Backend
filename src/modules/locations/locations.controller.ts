import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  async create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @Get()
  async findAll() {
    return this.locationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.locationsService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.locationsService.remove(id);
  }
}
