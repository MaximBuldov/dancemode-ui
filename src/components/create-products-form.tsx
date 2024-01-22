import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Select } from 'antd';
import dayjs from 'dayjs';
import { Categories, IKeys, IProduct, NameOfClass } from 'models';
import { useMemo, useState } from 'react';
import { productService } from 'services';
import { prepareProducts } from 'utils';

interface CreateProductsFormProps {
  closeModal: (data: boolean) => void
}

const { useForm, Item } = Form;

const checkboxOptions = [
  { label: NameOfClass.BEGINNER, value: Categories.BEGINNER },
  { label: NameOfClass.ADV, value: Categories.ADV }
];

export const CreateProductsForm = ({ closeModal }: CreateProductsFormProps) => {
  const [form] = useForm();
  const minMonth = useMemo(() => dayjs().format('YYYY-MM'), []);
  const maxMonth = useMemo(() => dayjs().add(6, 'month').format('YYYY-MM'), []);
  const [updatedMonth, setMinMonth] = useState(minMonth);
  const client = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: productService.createMany,
    onSuccess: ({ create }) => {
      client.setQueriesData(
        [IKeys.PRODUCTS],
        (products: IProduct[] | undefined) => (products && create) ? [...products, ...create] : products
      );
      form.resetFields();
      closeModal(true);
    }
  });

  return (
    <Form
      form={form}
      onFinish={(values) => mutate(prepareProducts(values))}
    >

      <Item
        label="Start month"
        name="startMonth"
      >
        <Input
          type="month"
          placeholder="Start month"
          min={minMonth}
          max={maxMonth}
          onChange={(event) => setMinMonth(event.target.value)}
        />
      </Item>
      <Item
        label="End month"
        name="endMonth"
      >
        <Input
          type="month"
          placeholder="End month"
          min={updatedMonth}
          max={maxMonth}
        />
      </Item>
      <Item
        label="Classes"
        name="classes"
      >
        <Select
          options={checkboxOptions}
          allowClear
          mode="multiple"
          labelInValue
          showSearch={false}
        />
      </Item>
      <Item>
        <Button block htmlType="submit" type="primary" loading={isLoading}>Submit</Button>
      </Item>
    </Form>
  );
};