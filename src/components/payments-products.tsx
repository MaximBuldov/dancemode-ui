import { Table } from 'antd';
import { IROrderProduct, IStatus } from 'models';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { Price } from './ui';

interface PaymentsProductsProps {
  data: IROrderProduct[];
}

const columns: ColumnsType<IROrderProduct> = [
  { title: 'Class', dataIndex: 'name', key: 'name' },
  {
    title: 'Date', dataIndex: 'meta_data', key: 'data',
    render: (_, el) => {
      const date = el.meta_data.find(el => el.key === IStatus.DATE)?.value;
      return dayjs(date).format('MMM D');
    }
  },
  {
    title: 'Price', dataIndex: 'name', key: 'name',
    render: (_, el) => el.total !== '0' ? <Price total={el.total} subtotal={el.subtotal} /> : '$0'
  }
];

export const PaymentsProducts = ({ data }: PaymentsProductsProps) => {
  return (
    <Table
      dataSource={data}
      columns={columns}
      pagination={false}
    />
  );
};