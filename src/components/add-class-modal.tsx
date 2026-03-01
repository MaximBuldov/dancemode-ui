import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, DatePicker, Divider, Drawer, Form, Input, Select } from 'antd';
import dayjs from 'dayjs';
import { useCategory, useTemplate } from 'hooks';
import { ICreateProductsForm, IKeys, IProduct } from 'models';
import { productService } from 'services';
import { prepareProducts } from 'utils';

const { useForm, Item } = Form;

interface AddClassModalProps {
  isOpen: boolean;
  closeModal: (data: boolean) => void;
}

export const AddClassModal = ({ isOpen, closeModal }: AddClassModalProps) => {
  const [form] = useForm();
  const client = useQueryClient();
  const { get: getTemplates } = useTemplate();
  const { get: getCat } = useCategory();
  const { mutate, isPending } = useMutation({
    mutationFn: productService.createMany,
    onSuccess: (data) => {
      const monthsToUpdate = new Set(
        data?.map((product) => dayjs(product.date_time).format('YYYY-MM'))
      );

      monthsToUpdate.forEach((month) => {
        client.setQueryData(
          [IKeys.PRODUCTS, { month }],
          (products: IProduct[] | undefined) =>
            products && [
              ...products,
              ...data.filter(
                (el) => dayjs(el.date_time).format('YYYY-MM') === month
              )
            ]
        );
      });
      form.resetFields();
      closeModal(true);
    }
  });

  return (
    <Drawer
      title={<span style={{ fontSize: 20 }}>Add class</span>}
      open={isOpen}
      footer={null}
      onClose={() => closeModal(false)}
    >
      <Select
        allowClear
        loading={getTemplates.isLoading}
        placeholder="Templates"
        style={{ width: '100%' }}
        options={getTemplates.data?.map((el) => ({
          label: `${el.name} - $${el.price}`,
          value: el.id
        }))}
        onChange={(value: number) => {
          const template = getTemplates.data?.find((el) => el.id === value);
          form.setFieldsValue({
            time: template?.time,
            name: template?.name,
            regular_price: template?.price,
            categories: template?.categories?.map((el) => el.id)
          });
        }}
      />
      <Divider size="small" />
      <Form<ICreateProductsForm>
        form={form}
        initialValues={{
          stock_quantity: 13
        }}
        onFinish={(values) => {
          mutate(prepareProducts(values));
        }}
        size="large"
      >
        <Item
          label="Dates"
          name="dates"
          rules={[{ required: true, message: 'Please select dates!' }]}
        >
          <DatePicker placeholder="Dates" minDate={dayjs()} multiple />
        </Item>
        <Item
          name="time"
          label="Time"
          rules={[{ required: true, message: 'Please input class time!' }]}
        >
          <Input type="time" />
        </Item>
        <Item
          name="name"
          label="Class name"
          rules={[{ required: true, message: 'Please input class name!' }]}
        >
          <Input placeholder="Class name" />
        </Item>
        <Item
          label="Price"
          name="regular_price"
          rules={[{ required: true, message: 'Please input class price!' }]}
        >
          <Input prefix="$" placeholder="100" style={{ width: '100%' }} />
        </Item>
        <Item label="Categories" name="categories">
          <Select
            mode="multiple"
            allowClear
            placeholder="Categories"
            style={{ width: '100%' }}
            options={getCat.data?.map((el) => ({
              label: el.name,
              value: el.id
            }))}
          />
        </Item>
        <Item
          label="Quantity"
          name="stock_quantity"
          rules={[{ required: true, message: 'Please input class capacity!' }]}
        >
          <Input placeholder="13" style={{ width: '100%' }} />
        </Item>
        <Item>
          <Button block htmlType="submit" type="primary" loading={isPending}>
            Submit
          </Button>
        </Item>
      </Form>
    </Drawer>
  );
};
