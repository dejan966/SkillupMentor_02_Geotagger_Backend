import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UpdateLocationDto } from './dto/update-location.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'entities/user.entity';
import {
  saveLocationImageToStorage,
  isFileExtensionSafe,
  removeFile,
} from 'helpers/imageStorage';
import { join } from 'path';
import { GetCurrentUser } from 'decorators/get-current-user.decorator';
import { PaginatedResult } from 'interfaces/paginated-result.interface';
import { UserGuard } from 'modules/auth/guards/user.guard';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createLocationDto: CreateLocationDto,
    @GetCurrentUser() user: User,
  ) {
    return this.locationsService.create(createLocationDto, user);
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('image_url', saveLocationImageToStorage))
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') location_id: number,
  ) {
    const filename = file?.filename;
    if (!filename)
      throw new BadRequestException('File must be a png, jpg/jpeg');
    const imagesFolderPath = join(process.cwd(), 'uploads/locations');
    const fullImagePath = join(imagesFolderPath + '/' + file.filename);
    if (await isFileExtensionSafe(fullImagePath)) {
      return this.locationsService.updateLocationImageId(location_id, filename);
    }
    removeFile(fullImagePath);
    throw new BadRequestException('File content does not match extension!');
  }

  @Get()
  async findAll(@Query('page') page: number): Promise<PaginatedResult> {
    return this.locationsService.paginate(page, ['user']);
  }

  @Get('picture')
  @UseGuards(JwtAuthGuard)
  async findByPicture(pic: string) {
    return this.locationsService.findBy({ image_url: pic });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
    return this.locationsService.findById(id, ['guesses', 'user']);
  }

  @Get('user/:id')
  @UseGuards(JwtAuthGuard)
  async findCurrUserLocations(@Param('id') userId: number) {
    return this.locationsService.findCurrUserLocations(userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, UserGuard)
  async update(
    @Param('id') id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, UserGuard)
  async remove(@Param('id') id: number) {
    return this.locationsService.remove(id);
  }
}
