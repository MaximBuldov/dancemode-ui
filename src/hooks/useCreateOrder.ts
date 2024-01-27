import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { IKeys, IResponseError } from 'models';
import { orderService } from 'services';
import { cartStore, userStore } from 'stores';

interface IUseCreateOrder {
  paymentIntentId: string;
  onErrorFn: (error: AxiosError<IResponseError>) => void;
  onSuccess?: () => void
}

export const useCreateOrder = ({ paymentIntentId, onErrorFn, onSuccess }: IUseCreateOrder) => {
  return useMutation({
    mutationFn: () => orderService.create({
      customer_id: Number(userStore.data?.id),
      line_items: cartStore.preparedData,
      coupon_lines: cartStore.preparedCoupons,
      payment_method: 'stripe',
      meta_data: [{
        key: '_stripe_intent_id',
        value: paymentIntentId
      }, {
        key: 'date',
        value: cartStore.orderDates
      }]
    }),
    mutationKey: [IKeys.ORDERS],
    onError: onErrorFn,
    onSuccess
  });
};