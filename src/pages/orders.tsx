import { MoreOutlined, SyncOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Collapse, CollapseProps, Divider, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { PaymentsProducts } from 'components';
import { FilterOrdersForm } from 'components/filter-orders-form';
import { OrderModalActions } from 'components/order-modal-actions';
import { IKeys, IOrderStatus, IROrder } from 'models';
import { useMemo, useState } from 'react';
import { orderService } from 'services';

const enum PERPAGE {
  FULL = 100,
  SMALL = 13
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
    { title: 'Customer', dataIndex: 'customer_name', key: 'customer' },
    {
      title: 'Total', dataIndex: 'total', key: 'total',
      render: (el) => el !== '0' && `$${Math.round(Number(el))}`
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
      dataIndex: 'id', key: 'actions',
      render: (el) => <MoreOutlined onClick={() => setModal(el)} />
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
        expandable={{
          expandedRowRender: (record) => record && <PaymentsProducts order={record} />,
          expandRowByClick: true
        }}
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