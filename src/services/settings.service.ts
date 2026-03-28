import { ISetting } from 'models';
import { BaseService } from './base.service';

const ENDPOINT = '/settings';

export const settingsService = new BaseService<ISetting>(ENDPOINT);
