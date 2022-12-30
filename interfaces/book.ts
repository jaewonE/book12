export interface IBook {
  id: string;
  name: string;
  category: string;
  coverImg: string;
  owner: string;
}

export interface IAxiosBookRes {
  status: number;
  data: IBook;
}

export interface IAxiosBookListRes {
  status: number;
  data: IBook[];
}
