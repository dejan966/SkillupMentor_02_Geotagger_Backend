import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from 'src/entities/log.entity';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import Logging from 'src/library/Logging';
import { Repository } from 'typeorm';
import { ActionsService } from '../actions/actions.service';
import { AbstractService } from '../common/abstract.service';
import { ComponentsService } from '../components/components.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService extends AbstractService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ){
    super(rolesRepository)
  }
}