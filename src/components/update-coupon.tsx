import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { App, Form } from 'antd';
import { AxiosResponse } from 'axios';
import { ICoupon } from 'models';
import { couponService } from 'services';
import { CouponForm } from './coupon-form';

interface UpdateCouponProps {
  coupon: ICoupon;
  closeDrawer: () => void;
  queryKey: QueryKey;
}

export const UpdateCoupon = ({
  coupon,
  closeDrawer,
  queryKey
}: UpdateCouponProps) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const client = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: couponService.update,
    onSuccess: (data) => {
      message.success('Coupon updated');
      client.setQueryData<AxiosResponse<ICoupon[]>>(queryKey, (oldStore) =>
        oldStore
          ? {
              ...oldStore,
              data: oldStore.data.map((order) =>
                order.id === data.id ? data : order
              )
            }
          : undefined
      );
    },
    onSettled: () => {
      form.resetFields();
      closeDrawer();
    }
  });
  return (
    <CouponForm
      onFinish={mutate}
      form={form}
      isLoading={isPending}
      initialValues={coupon}
    />
  );
};
