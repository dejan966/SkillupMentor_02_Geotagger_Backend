import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GuessesService } from './guesses.service';
import { CreateGuessDto } from './dto/create-guess.dto';
import { UpdateGuessDto } from './dto/update-guess.dto';

@Controller('guesses')
export class GuessesController {
  constructor(private readonly guessesService: GuessesService) {}

  @Post()
  create(@Body() createGuessDto: CreateGuessDto) {
    return this.guessesService.create(createGuessDto);
  }

  @Get()
  findAll() {
    return this.guessesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guessesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGuessDto: UpdateGuessDto) {
    return this.guessesService.update(+id, updateGuessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guessesService.remove(+id);
  }
}
