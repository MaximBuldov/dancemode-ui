import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber } from 'antd';
import { ICreateSingleProductsForm } from 'models';
import { productService } from 'services';

interface CreateSingleProductFormProps {
  closeModal: () => void
}

const { useForm, Item } = Form;

export const CreateSingleProductForm = ({ closeModal }: CreateSingleProductFormProps) => {
  const [form] = useForm();
  const { mutate, isLoading } = useMutation({
    mutationFn: productService.createOne,
    onSuccess: () => closeModal()
  });

  const onFinish = (values: ICreateSingleProductsForm) => {
    mutate({
      name: values.name,
      meta_data: [{ key: 'date_time', value: values.date_time }],
      regular_price: values.regular_price.toString(),
      virtual: true
    });
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
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
        <InputNumber prefix="$" placeholder="100" style={{ width: '100%' }} />
      </Item>
      <Item>
        <Button block htmlType="submit" type="primary" loading={isLoading}>Submit</Button>
      </Item>
    </Form>
  );
};