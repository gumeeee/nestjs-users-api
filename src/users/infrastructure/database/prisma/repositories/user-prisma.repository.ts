import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserModelMapper } from '../models/user-model.mapper';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

export class UserPrismaRepository implements UserRepository.Repository {
  sortableFields: string[] = ['name', 'created_at'];

  constructor(private prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new NotFoundError(`UserModel not found using email: ${email}`);
      }

      return UserModelMapper.toEntity(user);
    } catch (error) {
      throw new NotFoundError(`UserModel not found using email: ${email}`);
    }
  }

  async emailExists(email: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (user) {
      throw new ConflictError('Email addres already used');
    }
  }

  async search(
    props: UserRepository.SearchParams,
  ): Promise<UserRepository.SearchResult> {
    const sortable =
      this.sortableFields?.includes(props.sort as string) || false;
    const orderByField = sortable ? props.sort : 'created_at';
    const orderByDirection = sortable ? props.sortDirection : 'desc';

    const count = await this.prismaService.user.count({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter ?? '',
            mode: 'insensitive',
          },
        },
      }),
    });

    const userModels = await this.prismaService.user.findMany({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter ?? '',
            mode: 'insensitive',
          },
        },
      }),
      orderBy: {
        [orderByField as string]: orderByDirection,
      },
      skip:
        props.page && props.page > 0 ? (props.page - 1) * props.pageSize : 1,
      take: props.pageSize && props.pageSize > 0 ? props.pageSize : 15,
    });

    return new UserRepository.SearchResult({
      items: userModels.map(userModel => UserModelMapper.toEntity(userModel)),
      total: count,
      currentPage: props.page,
      pageSize: props.pageSize,
      sort: orderByField,
      sortDirection: orderByDirection,
      filter: props.filter,
    });
  }

  async insert(entity: UserEntity): Promise<void> {
    await this.prismaService.user.create({
      data: entity.toJSON(),
    });
  }

  async findById(id: string): Promise<UserEntity> {
    return await this._get(id);
  }

  async findAll(): Promise<UserEntity[]> {
    const userModels = await this.prismaService.user.findMany();
    return userModels.map(userModel => UserModelMapper.toEntity(userModel));
  }

  async update(entity: UserEntity): Promise<void> {
    await this._get(entity._id);
    await this.prismaService.user.update({
      where: { id: entity._id },
      data: entity.toJSON(),
    });
  }

  async delete(id: string): Promise<void> {
    await this._get(id);
    await this.prismaService.user.delete({
      where: { id },
    });
  }

  protected async _get(id: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundError(`UserModel not found using ID: ${id}`);
      }

      return UserModelMapper.toEntity(user);
    } catch (error) {
      throw new NotFoundError(`UserModel not found using ID: ${id}`);
    }
  }
}
