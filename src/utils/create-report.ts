import { IPaymentMethod, IROrder, IReport, NameOfClass } from 'models';

export const createReport = (arr: IROrder[]): IReport[] => {
  return Object.values(arr.reduce((acc: { [key: string]: IReport }, order) => {
    const key = order.group;
    acc[key] = acc[key] || {
      group: key,
      cash: 0,
      card: 0,
      revenue: 0,
      profit: 0,
      beginners: 0,
      adv: 0,
      totalStudents: 0
    };

    const cash = order.payment_method === IPaymentMethod.CASH ? Number(order.total) : 0;
    const card = order.payment_method === IPaymentMethod.STRIPE ? Number(order.total) : 0;

    acc[key].cash += cash;
    acc[key].card += card;
    acc[key].coupon += acc[key].coupon + (order.payment_method === IPaymentMethod.COUPON ? Number(order.total) : 0);
    acc[key].revenue = acc[key].cash + acc[key].card;
    acc[key].profit = acc[key].revenue - 10;
    acc[key].beginners += order.line_items.filter(el => el.name === NameOfClass.BEGINNER).length;
    acc[key].adv += order.line_items.filter(el => el.name === NameOfClass.ADV).length;
    acc[key].totalStudents = acc[key].adv + acc[key].beginners;

    return acc;
  }, {}));
};