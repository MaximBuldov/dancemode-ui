import { useMutation } from '@tanstack/react-query';
import { Button, Drawer, Form, Input, Select } from 'antd';
import dayjs from 'dayjs';
import { IProduct } from 'models';
import { bundleService } from 'services';

const { useForm, Item } = Form;

interface AddClassModalProps {
  isOpen: boolean;
  closeModal: (data: boolean) => void;
  products?: IProduct[];
}

export const CreateBundleModal = ({
  isOpen,
  closeModal,
  products
}: AddClassModalProps) => {
  const [form] = useForm();
  const { mutate, isPending } = useMutation({
    mutationFn: bundleService.create,
    onSuccess: (data) => {
      form.resetFields();
      closeModal(true);
    }
  });

  return (
    <Drawer
      title={<span style={{ fontSize: 20 }}>Create Bundle</span>}
      open={isOpen}
      footer={null}
      onClose={() => closeModal(false)}
    >
      <Form
        form={form}
        onFinish={(values) => {
          mutate(values);
        }}
      >
        <Item
          label="Classes"
          name="products"
          rules={[{ required: true, message: 'Please select products!' }]}
        >
          <Select
            mode="multiple"
            options={products?.map((el) => ({
              value: el.id,
              label: `${el.name} - ${dayjs(el.date_time).format('M/D ha')}`
            }))}
            allowClear
            showSearch
          />
        </Item>
        <Item
          label="Discount"
          name="discount"
          rules={[{ required: true, message: 'Please input discount!' }]}
        >
          <Input prefix="$" placeholder="15" style={{ width: '100%' }} />
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
