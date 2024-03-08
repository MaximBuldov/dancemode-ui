import { IPaymentMethod, IROrder, IReport, NameOfClass } from 'models';

export const createReport = (arr: IROrder[]): IReport[] => {
  return Object.values(arr.reduce((acc: { [key: string]: IReport }, order) => {
    const key = order.group;
    acc[key] = acc[key] || {
      date: key,
      cash: 0,
      card: 0,
      revenue: 0,
      profit: 0,
      beg: 0,
      adv: 0,
      students: 0,
      stripe: 0,
      coupons: 0
    } as IReport;

    const cash = order.payment_method === IPaymentMethod.CASH ? Number(order.total) : 0;
    const card = order.payment_method === IPaymentMethod.STRIPE ? Number(order.total) : 0;

    acc[key].cash += cash;
    acc[key].card += card;
    acc[key].coupons += (order.payment_method === IPaymentMethod.COUPON ? Number(order.total) : 0) + (order.coupon_lines?.reduce((acc, el) => acc + Number(el.discount || 0), 0) || 0);
    acc[key].stripe = (acc[key].stripe || 0) + (order.payment_method === IPaymentMethod.STRIPE ? (+order.total * 0.029) + 0.3 : 0);
    acc[key].revenue = acc[key].cash + acc[key].card;
    acc[key].beg += order.line_items.filter(el => el.name === NameOfClass.BEGINNER).length;
    acc[key].adv += order.line_items.filter(el => el.name === NameOfClass.ADV).length;
    acc[key].students = acc[key].adv + acc[key].beg;

    return acc;
  }, {}));
};