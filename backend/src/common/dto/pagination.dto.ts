import { Transform } from 'class-transformer';
import { IsPositive } from 'class-validator';

export class PaginationRequestDto {
  @IsPositive()
  @Transform(({ value }) => parseInt(value as string))
  page: number;

  @IsPositive()
  @Transform(({ value }) => parseInt(value as string))
  pageSize: number;
}

export class PaginationResponseDto<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
