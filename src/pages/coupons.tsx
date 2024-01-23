import { useQuery } from '@tanstack/react-query';
import { Table, Typography } from 'antd';
import { ICoupon, IKeys } from 'models';
import { couponService } from 'services';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const columns: ColumnsType<ICoupon> = [
  {
    title: 'Coupon', key: 'coupon', dataIndex: 'code',
    render: (el) => <Typography.Text copyable>{el}</Typography.Text>
  },
  { title: 'Expiry day', dataIndex: 'date_expires', key: 'date_expires', render: (el) => dayjs(el).format('MMM D') }
];

export const Coupons = () => {
  const { data, isFetching } = useQuery({
    queryFn: () => couponService.getMy(),
    queryKey: [IKeys.COUPONS]
  });

  return (
    <Table
      dataSource={data?.data}
      columns={columns}
      loading={isFetching}
      rowKey={(line) => line.id}
      size="small"
      pagination={false}
    />
  );
};