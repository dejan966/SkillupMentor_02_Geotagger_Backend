import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { GuessesService } from './guesses.service';
import { CreateGuessDto } from './dto/create-guess.dto';
import { User } from 'entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { GetCurrentUser } from 'decorators/get-current-user.decorator';

@Controller('guesses')
export class GuessesController {
  constructor(private readonly guessesService: GuessesService) {}

  @Post('location/:id')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createGuessDto: CreateGuessDto,
    @GetCurrentUser() user: User,
    @Param('id') locationId: number,
  ) {
    return this.guessesService.createGuess(createGuessDto, user, locationId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.guessesService.findAll(['location', 'user']);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findPersonalBest(
    @Query('page') page: number,
    @GetCurrentUser() user: User,
  ) {
    return this.guessesService.paginateCondition(page, ['location', 'user'], {
      user: { id: user.id },
    });
  }

  @Get('location/:id')
  @UseGuards(JwtAuthGuard)
  async findByLocation(@Param('id') locationId: number) {
    return this.guessesService.findPersonalByLocation(locationId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
    return this.guessesService.findById(id, ['location', 'user']);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number) {
    return this.guessesService.remove(id);
  }
}
