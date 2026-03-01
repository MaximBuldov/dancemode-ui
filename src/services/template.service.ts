import { ITemplate } from 'models';
import { BaseService } from './base.service';

const ENDPOINT = '/template';

export const templateService = new BaseService<ITemplate>(ENDPOINT);
