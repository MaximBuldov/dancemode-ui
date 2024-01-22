import dayjs from 'dayjs';
import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { ICoupon, IProduct } from 'models';
import { getAllMondaysOfMonth } from 'utils';

class CartStore {
  data: IProduct[] = [];
  coupons: ICoupon[] = [];

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, { name: 'cart', properties: ['data', 'coupons'], storage: window.localStorage });
  }

  add(data: IProduct) {
    const res = this.checkSale(data, true);
    if (res) {
      this.data.push(res);
    }
  }

  clear() {
    this.data = [];
    this.coupons = [];
    localStorage.removeItem('cart');
  }

  isInCart(product: IProduct) {
    return !!this.data.find(el => el.id === product.id);
  }

  remove(product: IProduct) {
    const index = this.data.findIndex(el => el.id === product.id);
    if (index !== -1) {
      this.data.splice(index, 1);
    }
    this.checkSale(product, false);
  }

  addCoupon(coupon: ICoupon) {
    this.coupons.push(coupon);
  }

  removeCoupon(id: number) {
    const index = this.coupons.findIndex(el => el.id === id);
    if (index !== -1) {
      this.coupons.splice(index, 1);
    }
  }

  get count() {
    return this.data.length;
  }

  get couponCount() {
    return this.coupons.length;
  }

  get isCoupons() {
    return this.couponCount > 0;
  }

  get couponsTotal() {
    return this.calculateTotal(this.coupons, 'amount');
  }

  get total() {
    return this.calculateTotal(this.data, 'total');
  }

  get subtotal() {
    return this.calculateTotal(this.data, 'price');
  }

  get orderDates() {
    return Array.from(new Set(this.data.map(obj => dayjs(obj.date_time).format('YYYY-MM')))).join(',');
  }

  get preparedData() {
    return this.data.map(el => ({
      product_id: el.id,
      quantity: 1,
      subtotal: el.price,
      total: el?.total || el.price
    }));
  }

  private checkSale(data: IProduct, action: boolean) {
    const mondays = getAllMondaysOfMonth(dayjs(data.date_time));
    const classes = action ? [...this.data, data] : this.data;
    const isWholeMonth = mondays.every(mon => classes.some(cls => cls.name === data.name && dayjs(cls.date_time).isSame(mon, 'day')));

    if (action && isWholeMonth) {
      this.data = classes.map(el => el.name === data.name && dayjs(el.date_time).isSame(data.date_time, 'month') ? ({
        ...el,
        total: '20'
      }) : el);
      return false;
    }

    if (!action && !isWholeMonth) {
      this.data = classes.map(el => {
        if (el.name === data.name && dayjs(el.date_time).isSame(data.date_time, 'month')) {
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

  private calculateTotal<T>(arr: T[], prop: keyof T) {
    return arr.reduce((acc, el) => {
      const price = el[prop] ? Number(el[prop]) : Number((el as IProduct).price);
      return acc + price;
    }, 0);
  }

}

export const cartStore = new CartStore();