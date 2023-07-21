import dayjs from 'dayjs';
import { makeAutoObservable } from 'mobx';
import { IMakeUp } from 'models';

class MakeupStore {
  data: IMakeUp[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setMakeups(data: IMakeUp[]) {
    this.data = data;
  }

  addMakeup(data: IMakeUp) {
    this.data?.push(data);
  }

  checkAvailable(day: dayjs.Dayjs) {
    return this.data.some(el => dayjs(el.acf.deadline).isAfter(day, 'day'));
  }

  removeMakeup(id: number) {
    this.data = this.data.filter(el => el.id !== id);
  }

  get oldestId() {
    return this.data[this.count - 1].id;
  }

  get count() {
    return this.data.length;
  }
}

export const makeupStore = new MakeupStore();