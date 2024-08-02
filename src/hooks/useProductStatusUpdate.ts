import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import dayjs from 'dayjs';
import { IProductStatus } from 'models';
import { orderProductService } from 'services';
import { updateProductStatus } from 'utils';

interface IUseProductStatusUpdate {
  day: dayjs.Dayjs;
  product_id: number;
  product_order_id: number;
  onSuccess?: () => void;
  isPaid: boolean;
}

export const useProductStatusUpdate = ({
  day,
  product_id,
  onSuccess,
  isPaid,
  product_order_id
}: IUseProductStatusUpdate) => {
  const client = useQueryClient();
  const isDeadline = dayjs().isBefore(day.subtract(5, 'hour'));
  const { message } = App.useApp();

  const { mutate, isPending } = useMutation({
    mutationFn: (productStatus: IProductStatus) =>
      orderProductService.update(
        {
          productStatus,
          isDeadline: isDeadline && isPaid
        },
        product_order_id
      ),
    onSuccess: (_, value) => {
      updateProductStatus(
        client,
        day.format('YYYY-MM'),
        product_id,
        [product_order_id],
        value
      );
      if (value === IProductStatus.CANCELED) {
        if (isDeadline) {
          isPaid
            ? message.success(
                'You have successfully canceled your class and received a coupon!'
              )
            : message.warning('Class was canceled');
        } else {
          message.warning('Class was canceled, but no coupon, is too late');
        }
      }

      if (value === IProductStatus.CONFIRMED) {
        message.success(
          'Thank you for your confirmation, I look forward to seeing you in class!'
        );
      }
      onSuccess && onSuccess();
    }
  });

  return { mutate, isPending };
};
