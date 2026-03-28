import { useQuery } from '@tanstack/react-query';
import {
  Descriptions,
  DescriptionsProps,
  Space,
  Table,
  Tag,
  Typography
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { ICoupon, IDiscountType, IKeys } from 'models';
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
    title: 'Amount',
    key: 'amount',
    align: 'center',
    dataIndex: 'amount',
    render: (el, record) =>
      record.discount_type === IDiscountType.CREDIT ? 1 : `$${el}`
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
        expandedRowRender: (el) => {
          const items: DescriptionsProps['items'] = [
            {
              key: '1',
              label: 'Allowed categories',
              children: (
                <Space>
                  {el.allowed_cat?.map((el) => (
                    <Tag color="blue">{el.name}</Tag>
                  ))}
                </Space>
              )
            },
            {
              key: '2',
              label: 'Description',
              children: el.description
            }
          ];
          return <Descriptions size="small" items={items} />;
        },
        rowExpandable: (el) => !!el.description || el.allowed_cat.length > 0
      }}
    />
  );
};
