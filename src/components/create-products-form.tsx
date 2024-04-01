import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, DatePicker, Form, Select } from 'antd';
import dayjs from 'dayjs';
import { IKeys, IProduct, catOptions } from 'models';
import { productService } from 'services';
import { prepareProducts } from 'utils';

interface CreateProductsFormProps {
  closeModal: (data: boolean) => void
}

const { useForm, Item } = Form;

export const CreateProductsForm = ({ closeModal }: CreateProductsFormProps) => {
  const [form] = useForm();
  const client = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: productService.createMany,
    onSuccess: ({ create }) => {
      client.setQueryData(
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
        label="Dates"
        name="dates"
      >
        <DatePicker
          placeholder="Start month"
          minDate={dayjs()}
          multiple
        />
      </Item>
      <Item
        label="Classes"
        name="classes"
      >
        <Select
          options={catOptions}
          allowClear
          mode="multiple"
          labelInValue
          showSearch={false}
        />
      </Item>
      <Item>
        <Button block htmlType="submit" type="primary" loading={isPending}>Submit</Button>
      </Item>
    </Form>
  );
};