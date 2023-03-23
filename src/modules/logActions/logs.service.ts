import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Component } from 'src/entities/component.entity';
import { Log } from 'src/entities/log.entity';
import { User } from 'src/entities/user.entity';
import Logging from 'src/library/Logging';
import { Repository } from 'typeorm';
import { ActionsService } from '../actions/actions.service';
import { AbstractService } from '../common/abstract.service';
import { ComponentsService } from '../components/components.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';

@Injectable()
export class LogsService extends AbstractService {
  constructor(
    @InjectRepository(Log)
    private readonly logsRepository: Repository<Log>,
    private readonly actionsService: ActionsService,
    private readonly componentService: ComponentsService
  ){
    super(logsRepository)
  }

  async create(createLogDto: CreateLogDto, user:User) {
    let action = await this.actionsService.findBy({action:createLogDto.action.action, url:createLogDto.action.url, new_value:createLogDto.action.new_value})
    if(!action){
      action = await this.actionsService.create({...createLogDto.action});
    }

    let component = null
    if(createLogDto.component){
      component = await this.componentService.findBy({component:createLogDto.component.component})
      if(!component){
        component = await this.componentService.create({...createLogDto.component});
      }
    }
    
    const newLog = await this.logsRepository.create({action, component, user});
    return this.logsRepository.save(newLog);
  }

  async update(id: number, updateLogDto: UpdateLogDto) {
    await this.actionsService.update(updateLogDto.action.id, updateLogDto.action)
    await this.componentService.update(updateLogDto.component.id, updateLogDto.component)
  }
}
