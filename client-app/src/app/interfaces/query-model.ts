export interface IQueryModel {
  pageSize: number;
  currentPage: number;
  sort?: string;
  sortDirection?: string;
  searchText?: string;
  type?: string;
  queryType?: string; // string, number, Date, ...
  selectedFilter?: any;
  min?: number;
  max?: number;
  includes?: string[];
  filters?: IFilter[];
}

interface IFilter {
  searchText?: string;
  type?: string;
  queryType?: string; // string, number, Date, ...
  min?: number;
  max?: number;
}