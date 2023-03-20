import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from 'src/entities/log.entity';
import { User } from 'src/entities/user.entity';
import Logging from 'src/library/Logging';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';

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

  async update(id: number, updateLogDto: UpdateLogDto) {
    const log = await this.findById(id);
    try {
      for (const key in log) {
        if (updateLogDto[key]) log[key] = updateLogDto[key];
      }
      return this.logsRepository.save(log);
    } catch (error) {
      Logging.log(error)
      throw new NotFoundException('Something went wrong while updating the data.');
    }
  }
}
