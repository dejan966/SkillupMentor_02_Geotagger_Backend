import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateLogDto } from './dto/create-log.dto';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { User } from 'src/entities/user.entity';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  async create(@Body() createLogDto: CreateLogDto, @GetCurrentUser() user:User) {
    return this.logsService.create(createLogDto, user);
  }

  @Get()
  async findAll() {
    return this.logsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
    return this.logsService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number) {
    return this.logsService.remove(id);
  }
}
