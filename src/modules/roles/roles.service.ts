import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'entities/role.entity';
import Logging from 'library/Logging';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService extends AbstractService<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {
    super(rolesRepository);
  }

  async create(createRoleDto: CreateRoleDto) {
    const role = await this.findBy({ role: createRoleDto.role });
    if (role) {
      throw new BadRequestException('This component already exists.');
    }
    try {
      const newRole = this.rolesRepository.create({ ...createRoleDto });
      return this.rolesRepository.save(newRole);
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'Something went wrong while creating a new componenet.',
      );
    }
  }
}
