import { Injectable } from '@nestjs/common';
import { CreateGuessDto } from './dto/create-guess.dto';
import { UpdateGuessDto } from './dto/update-guess.dto';

@Injectable()
export class GuessesService {
  create(createGuessDto: CreateGuessDto) {
    return 'This action adds a new guess';
  }

  findAll() {
    return `This action returns all guesses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} guess`;
  }

  update(id: number, updateGuessDto: UpdateGuessDto) {
    return `This action updates a #${id} guess`;
  }

  remove(id: number) {
    return `This action removes a #${id} guess`;
  }
}
