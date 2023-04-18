import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
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
    return this.actionsService.findAll(['logs']);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.actionsService.findById(id, ['logs']);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateActionDto: UpdateActionDto,
  ) {
    return this.actionsService.update(id, updateActionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.actionsService.remove(id);
  }
}
