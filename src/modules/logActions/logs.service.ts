import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    const action = await this.actionsService.findBy({action:createLogDto.action.action, url:createLogDto.action.url, new_value:createLogDto.action.new_value})
    if(!action){
      return this.actionsService.create({...createLogDto.action});
    }

    if(createLogDto.component){
      const component = await this.componentService.findBy({component:createLogDto.component.component})
      if(!component){
        return this.componentService.create({...createLogDto.component});
      }
    }
    
    const newLog = await this.logsRepository.create({...createLogDto, user});
    console.log(newLog)
    return this.logsRepository.save(newLog);
  }

  async update(id: number, updateLogDto: UpdateLogDto) {
    const updatedAction = await this.actionsService.update(updateLogDto.action.id, updateLogDto.action)
    const updatedComponent = await this.componentService.update(updateLogDto.component.id, updateLogDto.component)
  }
}
