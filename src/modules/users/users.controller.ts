import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard';
import { GetCurrentUser } from 'decorators/get-current-user.decorator';
import { User } from 'entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  saveAvatarToStorage,
  isFileExtensionSafe,
  removeFile,
} from 'helpers/imageStorage';
import { join } from 'path';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@GetCurrentUser() user: User) {
    return user;
  }

  @Get()
  async findAll() {
    return this.usersService.findAll(['role', 'locations', 'guesses']);
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('avatar', saveAvatarToStorage))
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
  ): Promise<User> {
    const filename = file?.filename;

    if (!filename)
      throw new BadRequestException('File must be a png, jpg/jpeg');

    const imagesFolderPath = join(process.cwd(), 'uploads/avatars');
    const fullImagePath = join(imagesFolderPath + '/' + file.filename);
    if (await isFileExtensionSafe(fullImagePath)) {
      return this.usersService.updateUserImageId(id, filename);
    }
    removeFile(fullImagePath);
    throw new BadRequestException('File content does not match extension!');
  }

  @Get('/user/:token')
  @UseGuards(JwtAuthGuard)
  async findByToken(@Param('token') token: string) {
    return this.usersService.findBy({ password_token: token });
  }

  @Get('me/reset-password')
  @UseGuards(JwtAuthGuard)
  async checkEmail(@Body() updateUserDto: { email: string }) {
    return this.usersService.checkEmail(updateUserDto.email);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findById(id, ['role', 'locations', 'guesses']);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('/me/update-password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @GetCurrentUser() user: User,
    @Body()
    updateUserDto: {
      current_password: string;
      password: string;
      confirm_password: string;
    },
  ) {
    return this.usersService.updatePassword(user, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
