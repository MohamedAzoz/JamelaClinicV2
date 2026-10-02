export interface PaginatedResult<T> {
  items: T;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

//  {
//     "pageNumber": 0,
//     "pageSize": 0,
//     "totalCount": 0,
//     "totalPages": 0,
//     "items": [

//     ]
//   }
