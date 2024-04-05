import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, DatePicker, Drawer, Form, Input, Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import dayjs from 'dayjs';
import { Categories, ICategoryOption, ICreateProductsForm, IKeys, IProduct, NameOfClass, catOptions } from 'models';
import { useMemo } from 'react';
import { productService } from 'services';
import { prepareProducts } from 'utils';

const { useForm, Item } = Form;

interface AddClassModalProps {
  isOpen: boolean;
  closeModal: (data: boolean) => void
}

export const AddClassModal = ({ isOpen, closeModal }: AddClassModalProps) => {
  const [form] = useForm();
  const client = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: productService.createMany,
    onSuccess: ({ create }) => {
      const monthsToUpdate = new Set(create?.map(product => dayjs(product.date_time).format('YYYY-MM')));
      monthsToUpdate.forEach(month => {
        client.setQueryData(
          [IKeys.PRODUCTS, { month }],
          (products: IProduct[] | undefined) => (products && create) ?
            [...products, ...create.filter(el => dayjs(el.date_time).format('YYYY-MM') === month)] :
            products
        );
      });
      form.resetFields();
      closeModal(true);
    }
  });
  const isCustom = Form.useWatch('classes', form)?.some((el: ICategoryOption) => el.label === NameOfClass.CUSTOM);

  const options = useMemo(() => {
    return isCustom ? catOptions.map(el => el.value !== Categories.CUSTOM ? { disabled: true, ...el } : el) : catOptions;
  }, [isCustom]);

  return (
    <Drawer
      title={<span style={{ fontSize: 20 }}>Add class</span>}
      open={isOpen}
      footer={null}
      onClose={() => closeModal(false)}
    >
      <Form<ICreateProductsForm>
        form={form}
        onFinish={(values) => mutate(prepareProducts(values))}
        size="large"
      >

        <Item
          label="Dates"
          name="dates"
          rules={[{ required: true, message: 'Please select dates!' }]}
        >
          <DatePicker
            placeholder="Dates"
            minDate={dayjs()}
            multiple
          />
        </Item>
        <Item
          label="Classes"
          name="classes"
          rules={[{ required: true, message: 'Please select class type!' }]}
        >
          <Select
            options={options}
            allowClear
            mode="multiple"
            labelInValue
            showSearch={false}
            onChange={(values: DefaultOptionType[]) => {
              const customOption = values.find(el => Categories.CUSTOM === el.value);
              if (!!customOption) {
                form.setFieldValue('classes', [customOption]);
              }
            }}
          />

        </Item>
        {isCustom && (
          <>
            <Item
              name="name"
              label="Class name"
              rules={[{ required: isCustom, message: 'Please input class name!' }]}
            >
              <Input placeholder="Class name" />
            </Item>
            <Item
              label="Price"
              name="regular_price"
              rules={[{ required: isCustom, message: 'Please input class price!' }]}
            >
              <Input prefix="$" placeholder="100" style={{ width: '100%' }} />
            </Item><Item
              label="Quantity"
              name="stock_quantity"
              rules={[{ required: isCustom, message: 'Please input class capacity!' }]}
            >
              <Input placeholder="13" style={{ width: '100%' }} />
            </Item></>
        )}
        <Item>
          <Button block htmlType="submit" type="primary" loading={isPending}>Submit</Button>
        </Item>
      </Form>
    </Drawer >
  );
};