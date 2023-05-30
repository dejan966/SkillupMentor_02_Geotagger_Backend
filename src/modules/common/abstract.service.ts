import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PaginatedResult } from 'interfaces/paginated-result.interface';
import Logging from 'library/Logging';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export abstract class AbstractService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async update(id: number, updateDataDto): Promise<T> {
    const data = await this.findById(id);
    try {
      for (const key in data) {
        if (updateDataDto[key] !== undefined) data[key] = updateDataDto[key];
      }
      return this.repository.save(data);
    } catch (error) {
      Logging.log(error);
      throw new NotFoundException(
        'Something went wrong while updating the data.',
      );
    }
  }

  async findAll(relations = []): Promise<T[]> {
    try {
      return this.repository.find({ relations });
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while searching for a list of elements.',
      );
    }
  }

  async findBy(condition, relations = []): Promise<T> {
    try {
      return this.repository.findOne({
        where: condition,
        relations,
      });
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        `Something went wrong while searching for an element with condition: ${condition}.`,
      );
    }
  }

  async findById(id:number, relations = []): Promise<T> {
    try {
      const element = await this.repository.findOne({
        where: { id } as unknown as FindOptionsWhere<T>,
        relations,
      });
      if (!element) {
        throw new BadRequestException(`Cannot find element with id: ${id}`);
      }
      return element;
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        `Something went wrong while searching for an element with an id: ${id}.`,
      );
    }
  }

  async remove(id: number): Promise<T> {
    const element = await this.findById(id);
    try {
      return this.repository.remove(element);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while deleting a element.',
      );
    }
  }

  async paginate(page = 1, relations = []): Promise<PaginatedResult> {
    const take = 9;
    try {
      const [data, total] = await this.repository.findAndCount({
        take,
        skip: (page - 1) * take,
        relations,
      });

      return {
        data: data,
        meta: {
          total,
          page,
          last_page: Math.ceil(total / take),
        },
      };
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while searching for paginated elements.',
      );
    }
  }
  
  async paginateCondition(page = 1, relations = [], condition): Promise<PaginatedResult> {
    const take = 9;
    try {
      const [data, total] = await this.repository.findAndCount({
        where: condition,
        take,
        skip: (page - 1) * take,
        relations,
      });

      return {
        data: data,
        meta: {
          total,
          page,
          last_page: Math.ceil(total / take),
        },
      };
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while searching for paginated elements.',
      );
    }
  }
}
