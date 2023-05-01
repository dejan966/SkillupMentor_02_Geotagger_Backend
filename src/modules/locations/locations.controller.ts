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
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UpdateLocationDto } from './dto/update-location.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'entities/user.entity';
import { saveLocationImageToStorage, isFileExtensionSafe, removeFile } from 'helpers/imageStorage';
import { join } from 'path';
import { GetCurrentUser } from 'decorators/get-current-user.decorator';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createLocationDto: CreateLocationDto, @GetCurrentUser() user: User) {
    return this.locationsService.create(createLocationDto, user);
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('image', saveLocationImageToStorage))
  @HttpCode(HttpStatus.CREATED)
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Param('id') location_id: number): Promise<User> {
    const filename = file?.filename;

    if (!filename) throw new BadRequestException('File must be a png, jpg/jpeg');

    const imagesFolderPath = join(process.cwd(), 'uploads/locations');
    const fullImagePath = join(imagesFolderPath + '/' + file.filename);
    if (await isFileExtensionSafe(fullImagePath)) {
      return this.locationsService.updateLocationImageId(location_id, filename);
    }
    removeFile(fullImagePath);
    throw new BadRequestException('File content does not match extension!');
  }


  @Get()
  async findAll() {
    return this.locationsService.findLocations();
  }

  @Get('picture')
  @UseGuards(JwtAuthGuard)
  async findByPicture(pic: string) {
    return this.locationsService.findBy(pic);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
    return this.locationsService.findById(id, ['guesses']);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number) {
    return this.locationsService.remove(id);
  }
}
