import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from 'src/entities/action.entity';
import Logging from 'src/library/Logging';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Injectable()
export class ActionsService extends AbstractService {
  constructor(
    @InjectRepository(Action)
    private readonly actionsRepository:Repository<Action>
  ){
    super(actionsRepository)
  }
  async create(createActionDto: CreateActionDto) {
    const action = await this.findBy({ action: createActionDto.action });
    if (action) {
      throw new BadRequestException('This action already exists.');
    }
    try {
      const newAction = this.actionsRepository.create({...createActionDto});
      return this.actionsRepository.save(newAction);
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException('Something went wrong while creating a new action.');
    }
    
  }

  async update(id: number, updateActionDto: UpdateActionDto) {
    const action = await this.findById(id);
    try {
      for (const key in action) {
        if (updateActionDto[key]) action[key] = updateActionDto[key];
      }
      return this.actionsRepository.save(action);
    } catch (error) {
      Logging.log(error)
      throw new NotFoundException('Something went wrong while updating the data.');
    }
  }
}
