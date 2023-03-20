import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';

@Controller('components')
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @Post()
  async create(@Body() createComponentDto: {component:string}) {
    return this.componentsService.create(createComponentDto);
  }

  @Get()
  async findAll() {
    return this.componentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.componentsService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateComponentDto: {name:string}) {
    return this.componentsService.update(id, updateComponentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.componentsService.remove(id);
  }
}
