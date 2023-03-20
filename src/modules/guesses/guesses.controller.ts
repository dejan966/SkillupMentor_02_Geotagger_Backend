import { Controller, Get, Post, Body, Patch, Param, Delete, ClassSerializerInterceptor, UseInterceptors, UseGuards } from '@nestjs/common';
import { GuessesService } from './guesses.service';
import { CreateGuessDto } from './dto/create-guess.dto';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UpdateGuessDto } from './dto/update-guess.dto';

@Controller('guesses')
export class GuessesController {
  constructor(private readonly guessesService: GuessesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createGuessDto: CreateGuessDto, @GetCurrentUser() user: User) {
    return this.guessesService.create(createGuessDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.guessesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
    return this.guessesService.findById(id);
  }
  
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, updateGuessDto:UpdateGuessDto) {
    return this.guessesService.update(id, updateGuessDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number) {
    return this.guessesService.remove(id);
  }
}
