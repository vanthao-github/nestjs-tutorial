export interface GetManyResponse<T> {
  data: T[];
  metadata: Metadata;
}

export interface Metadata {
  total: number;
}
