import { makeAutoObservable } from 'mobx';
import { IProduct } from 'models';

class ProductStore {
  data: null | IProduct[] = null;

  constructor() {
    makeAutoObservable(this);
  }

  setProducts(data: IProduct[]) {
    this.data = data;
  }

}

export const productStore = new ProductStore();