import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { App, Form } from 'antd';
import { AxiosResponse } from 'axios';
import { ICoupon } from 'models';
import { couponService } from 'services';
import { CouponForm } from './coupon-form';

interface CreateCouponProps {
  queryKey: QueryKey;
  closeDrawer: () => void;
}

export const CreateCoupon = ({ queryKey, closeDrawer }: CreateCouponProps) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const client = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: couponService.create,
    onSuccess: (data) => {
      message.success('Coupon created');
      client.setQueryData<AxiosResponse<ICoupon[]>>(queryKey, (oldStore) =>
        oldStore
          ? {
              ...oldStore,
              data: [data, ...oldStore.data]
            }
          : undefined
      );
    },
    onSettled: () => {
      closeDrawer();
      form.resetFields();
    }
  });
  return <CouponForm onFinish={mutate} form={form} isLoading={isPending} />;
};
