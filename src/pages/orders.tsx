import { useQuery } from '@tanstack/react-query';
import { Button, Collapse, CollapseProps, DatePicker, Divider, Form, Segmented, Select, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { PaymentsProducts } from 'components';
import dayjs from 'dayjs';
import { IKeys, IROrder } from 'models';
import React, { useMemo, useState } from 'react';
import { orderService, userService } from 'services';

const enum FILTERNAME {
  ORDER = 'By order',
  CLASS = 'By class'
}

const enum PERPAGE {
  FULL = 100,
  SMALL = 10
};

const columns: ColumnsType<IROrder> = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Date', dataIndex: 'date_created', key: 'date', render: (el) => dayjs(el).format('MMM D') },
  { title: 'Customer', dataIndex: 'customer_name', key: 'customer' },
  {
    title: 'Total', dataIndex: 'total', key: 'total',
    render: (el) => el !== '0' && `$${el}`
  }
];

const { Item, useForm } = Form;

export const Orders = () => {
  const [page, setPage] = useState(1);
  const [customers, setCustomers] = useState<{ value: string, label: string }[]>([]);
  const [dateName, setDateName] = useState<string | number>(FILTERNAME.ORDER);
  const [filters, setFilters] = useState({});
  const per_page = useMemo(() => Object.keys(filters).length > 0 ? PERPAGE.FULL : PERPAGE.SMALL, [filters]);
  const [form] = useForm();
  const orders = useQuery({
    queryFn: () => orderService.getAll({ page, per_page, ...filters }),
    queryKey: [IKeys.ORDERS, { page, ...filters }],
    staleTime: 1000 * 60
  });

  const users = useQuery({
    queryFn: userService.getCustomers,
    queryKey: [IKeys.CUSTOMERS],
    onSuccess: (data) => {
      const res = data.data.map(el => ({ value: el.id, label: `${el.first_name} ${el.last_name}` }));
      setCustomers(res);
    },
    enabled: customers.length === 0
  });

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Filters',
      children: renderForm()
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
          total: orders.isSuccess && orders.data?.headers['X-Wp-Total'],
          onChange: (number) => setPage(number)
        }}
      />
    </>
  );

  function renderForm() {
    return (
      <Form
        form={form}
        onFinish={(values) => {
          if (values?.month) {
            values['before'] = values.month.endOf('month').format('YYYY-MM-DDTHH:mm:ss');
            values['after'] = values.month.startOf('month').format('YYYY-MM-DDTHH:mm:ss');
            delete values.month;
          }
          if (values?.date) {
            values['date'] = values.date.format('YYYYMM');
          }
          setFilters(values);
        }}
      >
        <Item name="customer">
          <Select
            placeholder="Customers"
            loading={users.isLoading}
            options={customers}
          />
        </Item>
        <Space>
          <Item>
            <Segmented
              options={[FILTERNAME.ORDER, FILTERNAME.CLASS]}
              value={dateName}
              onChange={(val) => setDateName(val)}
            />
          </Item>
          <Item name={dateName === FILTERNAME.ORDER ? 'month' : 'date'}>
            <DatePicker picker="month" />
          </Item>
        </Space>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            loading={orders.isLoading}
          >
            Submit
          </Button>
          <Button
            htmlType="button"
            onClick={() => {
              form.resetFields();
              setFilters({});
            }}
          >
            Reset
          </Button>
        </Space>
      </Form >
    );
  }
};