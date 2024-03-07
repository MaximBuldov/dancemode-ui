import { Descriptions, DescriptionsProps, Divider, Spin, Table, Tag, Typography } from 'antd';
import { IKeys, IROrder, IROrderProduct } from 'models';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useUpdateOrder } from 'hooks';
import { useMemo, useState } from 'react';
import { userStore } from 'stores';

import { Price } from './ui';

interface PaymentsProductsProps {
  order: IROrder;
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

export const PaymentsProducts = ({ order }: PaymentsProductsProps) => {
  const [note, setNote] = useState(order?.note);
  const { mutate, isPending } = useUpdateOrder([IKeys.ORDERS, { id: order.id }]);
  const items = useMemo(() => {
    const arr: DescriptionsProps['items'] = [
      {
        key: 'date',
        label: 'Date',
        children: dayjs(order.date_created).format('MMM D')
      },
      {
        key: 'payment',
        label: 'Payment',
        children: order.payment_method
      }
    ];
    if (!!order.coupon_lines?.length) {
      arr.push({
        key: 'coupon',
        label: 'Coupon',
        children: order.coupon_lines.map(el => <Tag key={el.code}>{el.code} - ${el?.discount}</Tag>)
      });
    }
    if (userStore.isAdmin) {
      arr.push({
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
        >{isPending ? <Spin spinning /> : note}</Typography.Paragraph>
      });
    }
    return arr;
  }, [isPending, mutate, note, order]);
  return (
    <>
      <Descriptions
        items={items}
        size="small"
      />
      <Divider style={{ margin: 0 }} />
      <Table
        dataSource={order.line_items}
        columns={columns}
        pagination={false}
        rowKey={(line) => line.id}
        summary={(pageData) => {
          let subtotal = 0;
          let total = 0;
          pageData.forEach(el => {
            subtotal += Number(el.subtotal);
            total += Number(el.total);
          });
          const hasDiscount = subtotal !== total;
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} />
              <Table.Summary.Cell index={1} />
              <Table.Summary.Cell index={2}>{hasDiscount && `$${subtotal} / $${total}`}</Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </>
  );
};