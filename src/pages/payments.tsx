import { useQuery } from '@tanstack/react-query';
import { Table } from 'antd';
import { IKeys, IOrderStatus, IROrder } from 'models';
import { useState } from 'react';
import { orderService } from 'services';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { CancelOrderModal, PaymentsProducts } from 'components';
import { MoreOutlined, SyncOutlined } from '@ant-design/icons';

export const Payments = () => {
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<number | boolean>(0);
  const { data, isLoading } = useQuery({
    queryFn: () => orderService.getMyAll(page),
    queryKey: [IKeys.ORDERS, { page }],
    staleTime: 1000 * 60
  });

  const columns: ColumnsType<IROrder> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Date', dataIndex: 'date_created', key: 'date', render: (el) => dayjs(el).format('MMM D') },
    { title: 'Count', key: 'count', render: (_, record) => record.line_items.length, align: 'center' },
    {
      title: 'Total', dataIndex: 'total', key: 'total',
      render: (el) => el !== '0' && `$${el}`
    },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (el) => {
        switch (el) {
          case IOrderStatus.COMPLETED:
            return '✅';
          case IOrderStatus.CANCELLED:
            return '🚫';
          case IOrderStatus.PENDING:
            return <SyncOutlined spin style={{ color: '#0958d9' }} />;
          default:
            return '';
        }
      }
    },
    {
      dataIndex: 'status', key: 'status',
      render: (el, order) => el === IOrderStatus.PENDING && <MoreOutlined onClick={() => setModal(order.id)} />
    }
  ];

  return (
    <>
      <Table
        dataSource={data?.data}
        columns={columns}
        loading={isLoading}
        rowKey={(line) => line.id}
        size="small"
        expandable={{
          expandedRowRender: (record) => <PaymentsProducts order={record} />,
          expandRowByClick: true
        }}
        pagination={{
          current: page,
          pageSize: 10,
          total: data?.headers['x-wp-total'],
          onChange: (number) => setPage(number)
        }}
      />
      <CancelOrderModal
        open={!!modal}
        setOpen={setModal}
        id={Number(modal)}
        queryKey={[IKeys.ORDERS, { page }]}
      />
    </>
  );
};