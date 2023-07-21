import dayjs from 'dayjs';
import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { ICartProduct } from 'models';
import { getAllMondaysOfMonth } from 'utils';

import { userStore } from './userStore';

class CartStore {
  data: ICartProduct[] = [];

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, { name: 'cart', properties: ['data'], storage: window.localStorage });
  }

  addSingleProduct(data: ICartProduct) {
    const res = this.checkSale(data, true);
    if (res) {
      this.data.push(res);
    }
  }

  clearCart() {
    this.data = [];
    localStorage.removeItem('cart');
  }

  isProductInCart(product: ICartProduct) {
    return !!this.data.find(el => el.id === product.id && el.day === product.day);
  }

  removeFromCart(product: ICartProduct) {
    const index = this.data.findIndex(el => el.id === product.id && el.day === product.day);
    if (index !== -1) {
      this.data.splice(index, 1);
    }
    this.checkSale(product, false);
  }

  get count() {
    return this.data.length;
  }

  get total() {
    return this.calculateTotal(this.data, 'total');
  }

  get subtotal() {
    return this.calculateTotal(this.data, 'price');
  }

  get preparedData() {
    const months = Array.from(new Set(this.data.map(obj => obj.month))).join('');
    return {
      customer_id: userStore.data?.id,
      meta_data: [
        {
          key: 'date',
          value: months
        }
      ],
      line_items: this.data.map(el => ({
        product_id: el.id,
        quantity: 1,
        subtotal: el.price,
        total: el?.total || el.price,
        meta_data: [
          {
            key: 'date',
            value: el.day
          }
        ]
      }))
    };
  }

  private checkSale(data: ICartProduct, action: boolean) {
    const mondays = getAllMondaysOfMonth(dayjs(data.day).month());
    const classes = action ? [...this.data, data] : this.data;
    const isWholeMonth = mondays.every(mon => classes.some(cls => cls.name === data.name && dayjs(cls.day).isSame(mon, 'day')));

    if (action && isWholeMonth) {
      this.data = classes.map(el => el.name === data.name && dayjs(el.day).isSame(data.day, 'month') ? ({
        ...el,
        total: '20'
      }) : el);
      return false;
    }

    if (!action && !isWholeMonth) {
      this.data = classes.map(el => {
        if (el.name === data.name && dayjs(el.day).isSame(data.day, 'month')) {
          const { total, ...rest } = el;
          return rest;
        } else {
          return el;
        }
      });
      return false;
    }

    return data;
  }

  private calculateTotal(arr: ICartProduct[], prop: keyof ICartProduct) {
    return arr.reduce((acc, el) => {
      const price = el[prop] ? Number(el[prop]) : +el.price;
      return acc + price;
    }, 0);
  }

}

export const cartStore = new CartStore();