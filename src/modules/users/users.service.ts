import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import Logging from 'src/library/Logging';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findBy({ email: createUserDto.email });
    if (user) {
      throw new BadRequestException('User with that email already exists.');
    }
    try {
      const newUser = this.usersRepository.create({ ...createUserDto });
      return this.usersRepository.save(newUser);
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException('Something went wrong while creating a new user.');
    }
  }

  async findAll() {
    return await this.usersRepository.find({relations:['quote.user', 'vote.user'], });
  }

  async findBy(condition): Promise<User> {
    return this.usersRepository.findOne({ where: condition });
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id }, relations: ['quotes.votes.user', 'votes.quote']}) as User;
    return user;
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
