import { Button, Form, Input, Select } from 'antd';
import dayjs from 'dayjs';
import { Categories, IProduct, catOptions } from 'models';
import { useState } from 'react';

type IProductorm = Pick<
  IProduct,
  'date_time' | 'category_id' | 'price' | 'name' | 'stock_quantity'
>;

interface CreateSingleProductFormProps {
  onFinish: (values: Partial<IProduct>) => void;
  isPending: boolean;
  initialValues?: IProductorm;
}

const { useForm, Item } = Form;

export const ProductForm = ({
  onFinish,
  isPending,
  initialValues
}: CreateSingleProductFormProps) => {
  const [isCustomName, setCustomName] = useState(false);
  const [form] = useForm<IProductorm>();

  return (
    <Form<IProductorm>
      form={form}
      onFinish={(values) => {
        onFinish({
          ...values,
          date_time: dayjs(values.date_time).toDate()
        });
        form.resetFields();
      }}
      initialValues={{
        ...initialValues,
        date_time: dayjs(initialValues?.date_time).format('YYYY-MM-DDTHH:MM')
      }}
    >
      <Item<IProductorm> label="Day" name="date_time">
        <Input type="datetime-local" />
      </Item>
      {!initialValues && (
        <Item<IProductorm> label="Class name" name="category_id">
          <Select
            labelInValue
            options={catOptions}
            onChange={(el) => setCustomName(el.value === Categories.CUSTOM)}
          />
        </Item>
      )}
      {(isCustomName || !!initialValues) && (
        <Item<IProductorm> name="name" label={!!initialValues && 'Class name'}>
          <Input placeholder="Class name" />
        </Item>
      )}
      <Item<IProductorm> label="Price" name="price">
        <Input prefix="$" placeholder="100" style={{ width: '100%' }} />
      </Item>
      <Item label="Quantity" name="stock_quantity">
        <Input placeholder="13" style={{ width: '100%' }} />
      </Item>
      <Item>
        <Button block htmlType="submit" type="primary" loading={isPending}>
          Submit
        </Button>
      </Item>
    </Form>
  );
};
