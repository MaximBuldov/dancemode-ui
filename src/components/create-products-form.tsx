import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, DatePicker, Form, Select } from 'antd';
import dayjs from 'dayjs';
import { Categories, IKeys, IProduct, NameOfClass } from 'models';
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
        label="Months"
        name="months"
      >
        <DatePicker.RangePicker
          picker="month"
          allowClear
          disabledDate={(current) => current < dayjs().startOf('month')}
          style={{ width: '100%' }}
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
        />
      </Item>
      <Item>
        <Button block htmlType="submit" type="primary" loading={isLoading}>Submit</Button>
      </Item>
    </Form>
  );
};