export interface MetaData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

export class PaginatedResponse<T> {
  metaData: MetaData;
  items: T;

  constructor(items: T, metaData: MetaData) {
    this.items = items;
    this.metaData = metaData;
  }
}
