import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Component } from 'src/entities/component.entity';
import Logging from 'src/library/Logging';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';

@Injectable()
export class ComponentsService extends AbstractService {
  constructor(
    @InjectRepository(Component)
    private readonly componentsRepository:Repository<Component>
  ){
    super(componentsRepository)
  }
  async create(createComponentDto: CreateComponentDto) {
    const newComponent = this.componentsRepository.create({...createComponentDto});
    return this.componentsRepository.save(newComponent);
  }

  async update(id: number, updateComponentDto: UpdateComponentDto) {
    const component = await this.findById(id);
    try {
      component.component = updateComponentDto.component
      return this.componentsRepository.save(component);
    } catch (error) {
      Logging.log(error)
      throw new NotFoundException('Something went wrong while updating the data.');
    }
  }
}
