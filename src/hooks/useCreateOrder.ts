import { useMutation } from '@tanstack/react-query';
import { IKeys, IPaymentMethod } from 'models';
import { orderService } from 'services';
import { cartStore } from 'stores';

interface IUseCreateOrder {
  paymentIntentId?: string;
  onSuccess?: () => void;
  payment_method: IPaymentMethod;
}

export const useCreateOrder = ({
  paymentIntentId,
  onSuccess,
  payment_method
}: IUseCreateOrder) => {
  return useMutation({
    mutationFn: () =>
      orderService.create({
        line_items: cartStore.preparedData,
        coupons: cartStore.coupons,
        payment_method,
        stripe_id: paymentIntentId || ''
      }),
    mutationKey: [IKeys.ORDERS],
    onSuccess
  });
};
