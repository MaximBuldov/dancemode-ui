import { useMutation } from '@tanstack/react-query';
import { IKeys, IPaymentMethod } from 'models';
import { orderService } from 'services';
import { cartStore, userStore } from 'stores';

interface IUseCreateOrder {
  paymentIntentId?: string;
  onSuccess?: () => void,
  payment_method: IPaymentMethod
}

export const useCreateOrder = ({ paymentIntentId, onSuccess, payment_method }: IUseCreateOrder) => {
  return useMutation({
    mutationFn: () => orderService.create({
      customer_id: Number(userStore.data?.id),
      line_items: cartStore.preparedData,
      coupon_lines: cartStore.preparedCoupons,
      payment_method,
      billing: {
        first_name: userStore.data?.first_name,
        last_name: userStore.data?.last_name,
        city: 'San Diego',
        state: 'CA',
        email: userStore.data?.email,
        phone: userStore.data?.acf.billing_phone,
        country: 'US'
      },
      meta_data: [{
        key: '_stripe_intent_id',
        value: paymentIntentId || ''
      }, {
        key: 'date',
        value: cartStore.orderDates
      }]
    }),
    mutationKey: [IKeys.ORDERS],
    onSuccess
  });
};