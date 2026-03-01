import { ICategory } from './category.model';

export interface ITemplate {
  id: number;
  name: string;
  price: number;
  time: string;
  categories?: ICategory[];
}
