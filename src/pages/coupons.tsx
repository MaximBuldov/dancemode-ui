import { useQuery } from '@tanstack/react-query';
import { Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { ICoupon, IKeys } from 'models';
import { couponService } from 'services';

const columns: ColumnsType<ICoupon> = [
  {
    title: 'Coupon',
    key: 'coupon',
    dataIndex: 'code',
    render: (el: string) => (
      <Typography.Text copyable>{el.toUpperCase()}</Typography.Text>
    )
  },
  {
    title: '$',
    key: 'amount',
    dataIndex: 'amount',
    render: (el) => `$${el}`
  },
  {
    title: 'Expiry day',
    dataIndex: 'date_expires',
    key: 'date_expires',
    render: (el) => dayjs(el).format('MMM D')
  }
];

export const Coupons = () => {
  const { data, isFetching } = useQuery({
    queryFn: () => couponService.getMy(),
    queryKey: [IKeys.COUPONS]
  });

  return (
    <Table
      dataSource={data}
      columns={columns}
      loading={isFetching}
      rowKey={(line) => line.id}
      size="small"
      pagination={false}
      expandable={{
        expandedRowRender: (el) => el.description,
        rowExpandable: (el) => !!el.description
      }}
    />
  );
};
