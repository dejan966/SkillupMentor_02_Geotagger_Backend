import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from 'src/entities/log.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class LogsService extends AbstractService {
  constructor(
    @InjectRepository(Log)
    private readonly logsRepository: Repository<Log>
  ){
    super(logsRepository)
  }

  async create(createLogDto: CreateLogDto, user:User) {
    const newLog = this.logsRepository.create({...createLogDto, user});
    return this.logsRepository.save(newLog);
  }
}
