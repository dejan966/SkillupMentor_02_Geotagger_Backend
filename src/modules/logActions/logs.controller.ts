import { 
  Controller, 
  Post, 
  Body, 
  UseInterceptors, 
  ClassSerializerInterceptor, 
  UseGuards,
  Delete,
  Get,
  Param,
  Patch,
} from '@nestjs/common';import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateLogDto } from './dto/create-log.dto';
import { User } from 'entities/user.entity';
import { UpdateLogDto } from './dto/update-log.dto';

@Controller('logs')
@UseInterceptors(ClassSerializerInterceptor)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

/*   @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createLogDto: CreateLogDto, @GetCurrentUser() user:User) {
    return this.logsService.create(createLogDto, user);
  } */

  @Get()
  async findAll() {
    return this.logsService.findAll(['action', 'component', 'user']);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
    return this.logsService.findById(id, ['action', 'component', 'user']);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id:number, @Body() updateLogDto: UpdateLogDto) {
    return this.logsService.update(id, updateLogDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number) {
    return this.logsService.remove(id);
  }
}
