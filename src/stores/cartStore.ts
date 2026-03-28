import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { ICoupon, IProduct } from 'models';

class CartStore {
  data: IProduct[] = [];
  coupons: ICoupon[] = [];
  total: number = 0;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'cart',
      properties: ['data', 'coupons'],
      storage: window.localStorage
    });
  }

  add(data: IProduct) {
    this.data.push(data);
  }

  clear() {
    this.data = [];
    this.coupons = [];
    localStorage.removeItem('cart');
  }

  isInCart(product: IProduct) {
    return !!this.data.find((el) => el.id === product.id);
  }

  remove(product: IProduct) {
    const index = this.data.findIndex((el) => el.id === product.id);
    if (index !== -1) {
      this.data.splice(index, 1);
    }
  }

  addCoupon(coupon: ICoupon) {
    this.coupons.push(coupon);
  }

  removeCoupon(id: number) {
    const index = this.coupons.findIndex((el) => el.id === id);
    if (index !== -1) {
      this.coupons.splice(index, 1);
    }
  }

  isCouponAdded(code: string) {
    return this.coupons.some(
      (el) => el.code.toLocaleLowerCase() === code.toLocaleLowerCase()
    );
  }

  setTotal(total: number) {
    this.total = total;
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

  get preparedData() {
    return this.data.map((el) => ({
      product_id: el.id,
      subtotal: el.price,
      total: el.total || el.price
    }));
  }

  get cartProductIds() {
    return this.data.map((el) => el.id);
  }

  private calculateTotal<T>(arr: T[], prop: keyof T) {
    return arr.reduce((acc, el) => {
      const price = el[prop]
        ? Number(el[prop])
        : Number((el as IProduct).price);
      return acc + price;
    }, 0);
  }
}

export const cartStore = new CartStore();
