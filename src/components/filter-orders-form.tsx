import { useQuery } from '@tanstack/react-query';
import { Button, DatePicker, Form, Select, Space } from 'antd';
import { IKeys } from 'models';
import { useState } from 'react';
import { IFilters, userService } from 'services';

const { Item, useForm } = Form;

const enum FILTERNAME {
  ORDER = 'By order',
  CLASS = 'By class'
}

interface FilterOrdersFormProps {
  setFilters: (data: IFilters) => void;
}

export const FilterOrdersForm = ({ setFilters }: FilterOrdersFormProps) => {
  const [form] = useForm();
  const [dateName, setDateName] = useState<string | number>(FILTERNAME.ORDER);

  const users = useQuery({
    queryFn: () => userService.getCustomers(),
    queryKey: [IKeys.CUSTOMERS],
    select: ({ data }) =>
      data.map((el) => ({
        value: el.id,
        label: `${el.first_name} ${el.last_name}`
      }))
  });

  return (
    <Form
      form={form}
      onFinish={(values) => {
        if (values?.month) {
          values['before'] = values.month.endOf('month').toDate();
          values['after'] = values.month.startOf('month').toDate();
          delete values.month;
        }
        setFilters(values);
      }}
    >
      <Item name="customer">
        <Select
          placeholder="Customers"
          loading={users.isPending}
          options={users.data}
        />
      </Item>
      <Item name="month">
        <DatePicker picker="month" />
      </Item>
      <Space>
        <Button type="primary" htmlType="submit" loading={users.isPending}>
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
    </Form>
  );
};
