import dayjs, { Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { ICoupon, IProduct } from 'models';

class CartStore {
  data: IProduct[] = [];
  coupons: ICoupon[] = [];

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'cart',
      properties: ['data', 'coupons'],
      storage: window.localStorage
    });
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
    return !!this.data.find((el) => el.id === product.id);
  }

  remove(product: IProduct) {
    const index = this.data.findIndex((el) => el.id === product.id);
    if (index !== -1) {
      this.data.splice(index, 1);
    }
    this.checkSale(product, false);
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

  isExludedCat(coupon: ICoupon) {
    return this.data.every((el) => el.categories[0].id === coupon.exc_cat[0]);
  }

  checkCouponEligibility(userId: number, coupon: ICoupon) {
    if (!coupon.allowed_users.includes(userId)) {
      return { success: false, message: 'Coupon issued to another user' };
    }

    const totalCostExcluded = this.data.reduce((acc, el) => {
      if (el.categories[0].id === coupon.exc_cat[0]) {
        return acc;
      } else {
        return (acc += parseFloat(el.price));
      }
    }, 0);
    if (totalCostExcluded < parseFloat(coupon.amount)) {
      return {
        success: false,
        message:
          'The total cost of classes in the cart is less than the coupon amount'
      };
    }

    // Шаг 4: Проверка на один купон с категориями исключения
    if (
      coupon.exc_cat.length > 0 &&
      this.coupons.some((item) => item.exc_cat.length > 0)
    ) {
      return {
        success: false,
        message: 'You cannot use coupons for different groups at the same time'
      };
    }

    // Проверка даты истечения срока действия купона
    const expiryDate = dayjs(coupon.date_expires);
    if (expiryDate.isBefore(dayjs(), 'day')) {
      return { success: false, message: 'Coupon has expired' };
    }

    return { success: true, message: 'Купон может быть применен' };
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

  get totalMinusCoupons() {
    return this.total - this.couponsTotal;
  }

  get orderDates() {
    return Array.from(
      new Set(this.data.map((obj) => dayjs(obj.date_time).format('YYYY-MM')))
    ).join(',');
  }

  get preparedData() {
    return this.data.map((el) => ({
      product_id: el.id,
      quantity: 1,
      subtotal: el.price,
      total: el?.total || el.price
    }));
  }

  get preparedCoupons() {
    return this.coupons.map((el) => ({ code: el.code }));
  }

  get discount() {
    return this.subtotal - this.total;
  }

  get isDiscount() {
    return this.discount > 0;
  }

  private checkSale(data: IProduct, action: boolean) {
    const allDaysInMonth = this.getAllDaysOfMonth(dayjs(data.date_time));
    const classes = action ? [...this.data, data] : this.data;
    const isWholeMonth = allDaysInMonth.every((day) =>
      classes.some(
        (cls) =>
          cls.name === data.name && dayjs(cls.date_time).isSame(day, 'day')
      )
    );

    if (action && isWholeMonth) {
      this.data = classes.map((el) =>
        el.name === data.name &&
        dayjs(el.date_time).isSame(data.date_time, 'month') &&
        dayjs(el.date_time).day() === dayjs(data.date_time).day()
          ? {
              ...el,
              total: '20'
            }
          : el
      );
      return false;
    }

    if (!action && !isWholeMonth) {
      this.data = classes.map((el) => {
        if (
          el.name === data.name &&
          dayjs(el.date_time).isSame(data.date_time, 'month') &&
          dayjs(el.date_time).day() === dayjs(data.date_time).day()
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      const price = el[prop]
        ? Number(el[prop])
        : Number((el as IProduct).price);
      return acc + price;
    }, 0);
  }

  private getAllDaysOfMonth(currentDate: Dayjs) {
    const dayOfWeek = currentDate.day();
    const firstDayOfMonth = currentDate.startOf('month');

    let firstDay = firstDayOfMonth.day(dayOfWeek);

    if (firstDay.month() !== firstDayOfMonth.month()) {
      firstDay = firstDay.add(7, 'day');
    }

    const days = [];

    while (firstDay.month() === currentDate.month()) {
      days.push(firstDay);
      firstDay = firstDay.add(7, 'day');
    }

    return days;
  }
}

export const cartStore = new CartStore();
