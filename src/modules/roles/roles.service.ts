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
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService extends AbstractService {
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

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findById(id);
    try {
      role.role = updateRoleDto.role;
      return this.rolesRepository.save(role);
    } catch (error) {
      Logging.log(error);
      throw new NotFoundException(
        'Something went wrong while updating the data.',
      );
    }
  }
}
