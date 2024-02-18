import dayjs from 'dayjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IKeys, IProduct, IStatus } from 'models';
import { productService } from 'services';
import { userStore } from 'stores';

import { useError } from './useError';

interface IUseProductStatusUpdate {
  day: dayjs.Dayjs,
  product_id: number,
  onSuccess?: () => void,
  isPaid: boolean
}

export const useProductStatusUpdate = ({ day, product_id, onSuccess, isPaid }: IUseProductStatusUpdate) => {
  const { onErrorFn, contextHolder, messageApi } = useError();
  const client = useQueryClient();
  const isDeadline = dayjs().isBefore(day.subtract(5, 'hour'));

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ key }: { key: IStatus }) => productService.update({
      user_id: userStore.data?.id,
      field: key,
      isDeadline: isDeadline && isPaid
    }, product_id),
    onError: onErrorFn,
    onSuccess: (data, value) => {
      client.setQueryData([IKeys.PRODUCTS, { month: day.format('YYYY-MM') }], (items: IProduct[] | undefined) => {
        if (items) {
          const itemIndex = items.findIndex(el => el.id === product_id);
          items[itemIndex][value.key] = data[value.key];
        }

        return items;
      });

      if (value.key === IStatus.CANCEL) {
        if (isDeadline) {
          isPaid
            ? messageApi.success('You have successfully canceled your class and received a coupon!')
            : messageApi.warning('Class was canceled');
        } else {
          messageApi.warning('Class was canceled, but no coupon, is too late');
        }
      }

      if (value.key === IStatus.CONFIRM) {
        messageApi.success('Thank you for your confirmation, I look forward to seeing you in class!');
      }
      onSuccess && onSuccess();
    }
  });

  return { mutate, isLoading, contextHolder };
};