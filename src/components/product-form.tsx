import { Button, Form, Input, InputNumber, Select } from 'antd';
import dayjs from 'dayjs';
import { useCategory } from 'hooks';
import { ICreateProduct } from 'models';

interface CreateSingleProductFormProps {
  onFinish: (values: ICreateProduct) => void;
  isPending: boolean;
  initialValues?: ICreateProduct;
}

const { useForm, Item } = Form;

export const ProductForm = ({
  onFinish,
  isPending,
  initialValues
}: CreateSingleProductFormProps) => {
  const [form] = useForm<ICreateProduct>();
  const { catOptions } = useCategory();

  return (
    <Form<ICreateProduct>
      form={form}
      onFinish={(values) => {
        onFinish({
          ...values,
          date_time: dayjs(values.date_time).toDate()
        });
      }}
      initialValues={{
        ...initialValues,
        date_time: dayjs(initialValues?.date_time).format('YYYY-MM-DDTHH:MM')
      }}
    >
      <Item<ICreateProduct> label="Day" name="date_time">
        <Input type="datetime-local" />
      </Item>
      {!!initialValues && (
        <Item<ICreateProduct>
          name="name"
          label={!!initialValues && 'Class name'}
        >
          <Input placeholder="Class name" />
        </Item>
      )}
      <Item<ICreateProduct> label="Categories" name="categories">
        <Select mode="multiple" options={catOptions} />
      </Item>
      <Item<ICreateProduct> label="Price" name="price">
        <InputNumber prefix="$" placeholder="100" style={{ width: '100%' }} />
      </Item>
      <Item label="Quantity" name="stock_quantity">
        <InputNumber placeholder="13" style={{ width: '100%' }} />
      </Item>
      <Item>
        <Button block htmlType="submit" type="primary" loading={isPending}>
          Submit
        </Button>
      </Item>
    </Form>
  );
};
