import { Button, Form, Input, Select } from 'antd';
import { Categories, IProduct, catOptions } from 'models';
import { useState } from 'react';

interface CreateSingleProductFormProps {
  onFinish: (values: Partial<IProduct>) => void,
  isPending: boolean,
  initialValues?: Partial<IProduct>
}

const { useForm, Item } = Form;

export const ProductForm = ({ onFinish, isPending, initialValues }: CreateSingleProductFormProps) => {
  const [isCustomName, setCustomName] = useState(false);
  const [form] = useForm();

  return (
    <Form<Partial<IProduct>>
      form={form}
      onFinish={(values) => {
        onFinish(values);
        form.resetFields();
      }}
      initialValues={initialValues}
    >

      <Item
        label="Day"
        name="date_time"
      >
        <Input type="datetime-local" />
      </Item>
      {!initialValues && (
        <Item
          label="Class name"
          name="category"
        >
          <Select
            labelInValue
            options={catOptions}
            onChange={(el) => setCustomName(el.value === Categories.CUSTOM)}
          />
        </Item>
      )}
      {(isCustomName || !!initialValues) && (
        <Item
          name="name"
          label={!!initialValues && 'Class name'}
        >
          <Input placeholder="Class name" />
        </Item>
      )}
      <Item
        label="Price"
        name="regular_price"
      >
        <Input prefix="$" placeholder="100" style={{ width: '100%' }} />
      </Item>
      <Item
        label="Quantity"
        name="stock_quantity"
      >
        <Input placeholder="13" style={{ width: '100%' }} />
      </Item>
      <Item>
        <Button block htmlType="submit" type="primary" loading={isPending}>Submit</Button>
      </Item>
    </Form>
  );
};