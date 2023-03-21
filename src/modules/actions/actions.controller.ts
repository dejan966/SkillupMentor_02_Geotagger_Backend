import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { IsEmpty } from 'class-validator';
import { IsNull } from 'typeorm';
import { ActionsService } from './actions.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Post()
  async create(@Body() createActionDto: CreateActionDto) {
    return this.actionsService.create(createActionDto);
  }

  @Get()
  async findAll() {
    return this.actionsService.findAll();
  }

/*   @Get('action')
  async findByAction() {
    const action = await this.actionsService.findBy({action:'deleted value'});
    if(!action){
      console.log('0')
    }
  } */

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.actionsService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateActionDto: UpdateActionDto) {
    return this.actionsService.update(id, updateActionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.actionsService.remove(id);
  }
}
