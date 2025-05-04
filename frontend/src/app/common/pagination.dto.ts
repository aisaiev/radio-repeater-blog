export interface PaginationRequestDto {
    page: number;
    pageSize: number;
}

export interface PaginationResponseDto<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}
