import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Descriptions,
  DescriptionsProps,
  Divider,
  Drawer,
  Space,
  Table,
  TableProps,
  Tag
} from 'antd';
import { AxiosResponse } from 'axios';
import { CreateCoupon, UpdateCoupon } from 'components';
import dayjs from 'dayjs';
import { ICoupon, IDiscountType, IKeys } from 'models';
import { useMemo, useState } from 'react';
import { couponService } from 'services';

export const AllCoupons = () => {
  const [drawer, setDrawer] = useState<boolean | ICoupon>(false);
  const [page, setPage] = useState(1);
  const client = useQueryClient();
  const queryKey = useMemo(() => [IKeys.COUPONS, { page }], [page]);
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => couponService.getAllCoupons(page)
  });

  const remove = useMutation({
    mutationFn: (id: number) => couponService.remove(id),
    onSuccess: (data) => {
      client.setQueryData(
        [IKeys.COUPONS, { page }],
        (oldData: AxiosResponse<ICoupon[]> | undefined) => ({
          ...oldData,
          data: oldData?.data.filter((el) => el.id !== data.id)
        })
      );
    }
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
      align: 'center',
      key: 'amount',
      render: (el, record) =>
        record.discount_type === IDiscountType.CREDIT ? 1 : `$${el}`
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      align: 'center',
      key: 'created',
      render: (el) => dayjs(el).format('MM/DD')
    },
    {
      key: 'actions',
      dataIndex: 'id',
      align: 'center',
      render: (_, record) => (
        <Space size="large">
          <EditTwoTone onClick={() => setDrawer(record)} />
          <DeleteTwoTone
            twoToneColor="#cf1322"
            onClick={() => remove.mutate(record.id)}
          />
        </Space>
      )
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
        loading={isLoading || remove.isPending}
        dataSource={data?.data}
        size="small"
        pagination={{
          current: page,
          pageSize: 10,
          total: data?.headers['total'],
          onChange: (number) => setPage(number)
        }}
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
      <Drawer
        open={!!drawer}
        onClose={() => setDrawer(false)}
        title={
          drawer === true
            ? 'Create coupon'
            : `Edit coupon ${(drawer as ICoupon).code}`
        }
        size="large"
        destroyOnHidden
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
