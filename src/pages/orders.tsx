import { MoreOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Collapse, CollapseProps, Divider, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { PaymentsProducts } from 'components';
import { FilterOrdersForm } from 'components/filter-orders-form';
import { OrderModalActions } from 'components/order-modal-actions';
import dayjs from 'dayjs';
import { IKeys, IOrderStatus, IROrder } from 'models';
import { useMemo, useState } from 'react';
import { orderService } from 'services';

const enum PERPAGE {
  FULL = 100,
  SMALL = 10
};

export const Orders = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [modal, setModal] = useState(0);
  const per_page = useMemo(() => Object.keys(filters).length > 0 ? PERPAGE.FULL : PERPAGE.SMALL, [filters]);

  const queryKey = [IKeys.ORDERS, { page, ...filters }];
  const orders = useQuery({
    queryFn: () => orderService.getAll({ page, per_page, ...filters }),
    queryKey,
    staleTime: 1000 * 60
  });

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Filters',
      children: <FilterOrdersForm setFilters={setFilters} />
    }
  ];

  const columns: ColumnsType<IROrder> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Date', dataIndex: 'date_created', key: 'date', render: (el) => dayjs(el).format('MMM D') },
    { title: 'Customer', dataIndex: 'customer_name', key: 'customer' },
    {
      title: 'Total', dataIndex: 'total', key: 'total',
      render: (el) => el !== '0' && `$${el}`
    },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (el) => <Tag color={el === IOrderStatus.COMPLETED ? 'green' : el === IOrderStatus.CANCELLED ? 'red' : 'blue'}>{el}</Tag>
    },
    {
      dataIndex: 'status', key: 'actions',
      render: (el, order) => el === IOrderStatus.PENDING && <MoreOutlined onClick={() => setModal(order.id)} />
    }
  ];

  return (
    <>
      <Collapse items={items} size="small" />
      <Divider />
      <Table
        dataSource={orders.data?.data}
        columns={columns}
        loading={orders.isFetching}
        rowKey={(line) => line.id}
        size="small"
        expandable={{ expandedRowRender: (record) => record && <PaymentsProducts data={record.line_items} /> }}
        pagination={{
          current: page,
          pageSize: per_page,
          total: orders.isSuccess && orders.data?.headers['x-wp-total'],
          onChange: (number) => setPage(number)
        }}
      />
      <OrderModalActions
        setOpen={setModal}
        id={modal}
        queryKey={queryKey}
      />
    </>
  );
};