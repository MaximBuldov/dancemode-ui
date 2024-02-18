import { Descriptions, DescriptionsProps, Divider, Spin, Table, Typography } from 'antd';
import { IKeys, IROrder, IROrderProduct } from 'models';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useUpdateOrder } from 'hooks';
import { useState } from 'react';

import { Price } from './ui';

interface PaymentsProductsProps {
  order: IROrder;
  info?: boolean;
}

const columns: ColumnsType<IROrderProduct> = [
  { title: 'Class', dataIndex: 'name', key: 'name' },
  {
    title: 'Date', dataIndex: 'date_time', key: 'data',
    render: (el) => dayjs(el).format('MMM D')
  },
  {
    title: 'Price', dataIndex: 'name', key: 'name',
    render: (_, el) => el.total !== '0' ? <Price total={el.total} subtotal={el.subtotal} /> : '$0'
  }
];

export const PaymentsProducts = ({ order, info }: PaymentsProductsProps) => {
  const [note, setNote] = useState(order?.note);
  const { mutate, isLoading } = useUpdateOrder([IKeys.ORDERS, { id: order.id }]);
  const items: DescriptionsProps['items'] = [
    {
      key: 'date',
      label: 'Date',
      children: dayjs(order.date_created).format('MMM D')
    },
    {
      key: 'payment',
      label: 'Payment',
      children: order.payment_method
    },
    {
      key: 'note',
      label: 'Note',
      children: <Typography.Paragraph
        editable={{
          onChange: (value) => {
            setNote(value);
            mutate({ id: order.id, data: { note: value } });
          },
          text: note,
          triggerType: ['icon', 'text'],
          enterIcon: null
        }}
      >{isLoading ? <Spin spinning /> : note}</Typography.Paragraph>
    }
  ];
  return (
    <>
      {info && (
        <>
          <Descriptions
            items={items}
            size="small"
          />
          <Divider style={{ margin: 0 }} />
        </>
      )}
      <Table
        dataSource={order.line_items}
        columns={columns}
        pagination={false}
        rowKey={(line) => line.id}
      />
    </>
  );
};