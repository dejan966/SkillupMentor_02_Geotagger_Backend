import { 
  Controller, 
  Post, 
  Body, 
  UseInterceptors, 
  ClassSerializerInterceptor,
  UseGuards,
  Delete,
  Get,
  Param,
  Patch,
} from '@nestjs/common';import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard';

@Controller('roles')
@UseInterceptors(ClassSerializerInterceptor)
export class RolesController{
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.rolesService.findAll(['user']);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
    return this.rolesService.findById(id, ['user']);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number) {
    return this.rolesService.remove(id);
  }
}