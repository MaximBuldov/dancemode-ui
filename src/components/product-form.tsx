import { Button, Form, Input } from 'antd';
import { ICreateSingleProductsForm } from 'models';

interface CreateSingleProductFormProps {
  onFinish: (values: ICreateSingleProductsForm) => void,
  isLoading: boolean,
  initialValues?: ICreateSingleProductsForm
}

const { useForm, Item } = Form;

export const ProductForm = ({ onFinish, isLoading, initialValues }: CreateSingleProductFormProps) => {
  const [form] = useForm();

  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={initialValues}
    >

      <Item
        label="Day"
        name="date_time"
      >
        <Input type="datetime-local" />
      </Item>
      <Item
        label="Class name"
        name="name"
      >
        <Input placeholder="Class name" />
      </Item>
      <Item
        label="Price"
        name="regular_price"
      >
        <Input prefix="$" placeholder="100" style={{ width: '100%' }} />
      </Item>
      <Item>
        <Button block htmlType="submit" type="primary" loading={isLoading}>Submit</Button>
      </Item>
    </Form>
  );
};