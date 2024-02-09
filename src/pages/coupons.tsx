/* eslint-disable indent */
import { useQuery } from '@tanstack/react-query';
import { Table, Tag, Typography } from 'antd';
import { Categories, ICoupon, IKeys, NameOfClass } from 'models';
import { couponService } from 'services';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const columns: ColumnsType<ICoupon> = [
  {
    title: 'Coupon', key: 'coupon', dataIndex: 'code',
    render: (el: string) => <Typography.Text copyable>{el.toUpperCase()}</Typography.Text>
  },
  { title: 'Ex. groups', key: 'groups', dataIndex: 'excluded_product_categories', render: (el) => getCatName(el).map(group => <Tag key={group} color="purple">{group}</Tag>) },
  { title: 'Expiry day', dataIndex: 'date_expires', key: 'date_expires', render: (el) => dayjs(el).format('MMM D') }
];

const getCatName = (idArr: number[]) => {
  return idArr.map(id => {
    switch (id) {
      case Categories.BEGINNER:
        return NameOfClass.BEGINNER;
      case Categories.ADV:
        return NameOfClass.ADV;
      case Categories.CUSTOM:
        return NameOfClass.CUSTOM;
      default:
        return '';
    };
  });
};

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