import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts';
import { ListUsersUseCase } from '@/users/application/usecases/listusers.usecase';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ListUsersDto implements ListUsersUseCase.Input {
  @ApiPropertyOptional({ description: 'Página que será retornada' })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Tamanho da página que será retornada' })
  @IsOptional()
  pageSize?: number;

  @ApiPropertyOptional({
    description:
      'Coluna definida para ordenação dos dados: "name" ou "created_at"',
  })
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({ description: 'Ordenação dos dados: "asc" ou "desc"' })
  @IsOptional()
  sortDirection?: SortDirection;

  @ApiPropertyOptional({
    description: 'Dado informado para filtrar o resultado',
  })
  @IsOptional()
  filter?: string;
}
