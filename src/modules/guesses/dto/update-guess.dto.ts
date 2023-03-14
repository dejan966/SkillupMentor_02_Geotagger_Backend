import { PartialType } from '@nestjs/swagger';
import { CreateGuessDto } from './create-guess.dto';

export class UpdateGuessDto extends PartialType(CreateGuessDto) {}
