import { Controller, Get, Post, Body, Patch, Param, Delete, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { GuessesService } from './guesses.service';
import { CreateGuessDto } from './dto/create-guess.dto';

@Controller('guesses')
export class GuessesController {
  constructor(private readonly guessesService: GuessesService) {}

  @Post()
  async create(@Body() createGuessDto: CreateGuessDto) {
    return this.guessesService.create(createGuessDto);
  }

  @Get()
  async findAll() {
    return this.guessesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.guessesService.findById(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.guessesService.remove(id);
  }
}
