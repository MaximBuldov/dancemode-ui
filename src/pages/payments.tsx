import { useQuery } from '@tanstack/react-query';
import { Table, Tag } from 'antd';
import { IKeys, IROrder } from 'models';
import React, { useState } from 'react';
import { orderService } from 'services';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { PaymentsProducts } from 'components';

const columns: ColumnsType<IROrder> = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Date', dataIndex: 'date_created', key: 'date', render: (el) => dayjs(el).format('MMM D') },
  { title: 'Count', key: 'count', render: (_, record) => record.line_items.length, align: 'center' },
  {
    title: 'Status', dataIndex: 'total', key: 'status',
    render: (el) => el === '0' ?
      <Tag color="warning">Rescheduled</Tag> :
      <Tag color="processing">Payed</Tag>
  },
  {
    title: 'Total', dataIndex: 'total', key: 'total',
    render: (el) => el !== '0' && `$${el}`
  }
];

export const Payments = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryFn: () => orderService.getAll(page),
    queryKey: [IKeys.ORDERS, { page }],
    staleTime: 1000 * 60
  });

  return (
    <Table
      dataSource={data?.data}
      columns={columns}
      loading={isLoading}
      rowKey={(line) => line.id}
      size="small"
      expandable={{
        expandedRowRender: (record) => <PaymentsProducts data={record.line_items} />,
        rowExpandable: (record) => record.total !== '0'
      }}
      pagination={{
        current: page,
        pageSize: 10,
        total: data?.headers['x-wp-total'],
        onChange: (number) => setPage(number)
      }}
    />
  );
};