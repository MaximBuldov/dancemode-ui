import { ICategory } from 'models';
import { BaseService } from './base.service';

const ENDPOINT = '/category';

export const categoryService = new BaseService<ICategory>(ENDPOINT);
