import { Button, Form, Input, Select } from 'antd';
import { Categories, ICreateSingleProductsForm, NameOfClass } from 'models';
import { useState } from 'react';

interface CreateSingleProductFormProps {
  onFinish: (values: ICreateSingleProductsForm) => void,
  isLoading: boolean,
  initialValues?: ICreateSingleProductsForm
}

const { useForm, Item } = Form;

export const ProductForm = ({ onFinish, isLoading, initialValues }: CreateSingleProductFormProps) => {
  const [isCustomName, setCustomName] = useState(false);
  const [form] = useForm();

  return (
    <Form<ICreateSingleProductsForm>
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
            options={[
              { label: NameOfClass.BEGINNER, value: Categories.BEGINNER },
              { label: NameOfClass.ADV, value: Categories.ADV },
              { label: NameOfClass.CUSTOM, value: Categories.CUSTOM }
            ]}
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
      <Item>
        <Button block htmlType="submit" type="primary" loading={isLoading}>Submit</Button>
      </Item>
    </Form>
  );
};