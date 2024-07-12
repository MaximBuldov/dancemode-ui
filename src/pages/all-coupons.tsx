import { EditTwoTone } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Divider, Drawer, Table, TableProps, Tag } from 'antd';
import { CreateCoupon, UpdateCoupon } from 'components';
import dayjs from 'dayjs';
import { ICoupon, IKeys } from 'models';
import { useMemo, useState } from 'react';
import { couponService } from 'services';

export const AllCoupons = () => {
  const [drawer, setDrawer] = useState<boolean | ICoupon>(false);
  const [page, setPage] = useState(1);
  const queryKey = useMemo(() => [IKeys.COUPONS, { page }], [page]);
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => couponService.getAll(page)
  });

  const columns: TableProps<ICoupon>['columns'] = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (el, record) => (
        <Tag color={dayjs().isBefore(record.date_expires) ? 'green' : 'red'}>
          {el}
        </Tag>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (el) => `$${el}`
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created',
      render: (el) => dayjs(el).format('MM/DD')
    },
    {
      key: 'actions',
      dataIndex: 'id',
      render: (_, record) => <EditTwoTone onClick={() => setDrawer(record)} />
    }
  ];

  return (
    <>
      <Button type="primary" size="large" block onClick={() => setDrawer(true)}>
        Create coupon
      </Button>
      <Divider />
      <Table
        columns={columns}
        rowKey={(el) => el.id}
        loading={isLoading}
        dataSource={data?.data}
        size="small"
        pagination={{
          current: page,
          pageSize: 10,
          total: data?.headers['total'],
          onChange: (number) => setPage(number)
        }}
      />
      <Drawer
        open={!!drawer}
        onClose={() => setDrawer(false)}
        title={
          drawer === true
            ? 'Create coupon'
            : `Edit coupon ${(drawer as ICoupon).code}`
        }
        size="large"
        destroyOnClose
      >
        {drawer === true ? (
          <CreateCoupon
            closeDrawer={() => setDrawer(false)}
            queryKey={queryKey}
          />
        ) : (
          <UpdateCoupon
            coupon={drawer as ICoupon}
            closeDrawer={() => setDrawer(false)}
            queryKey={queryKey}
          />
        )}
      </Drawer>
    </>
  );
};
