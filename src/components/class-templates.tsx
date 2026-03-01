import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Table,
  TableProps,
  Tag
} from 'antd';
import { DeleteIcon } from 'components';
import { useCategory, useTemplate } from 'hooks';
import { ICategory } from 'models';
import { ITemplate } from 'models/template.model';
import { useState } from 'react';

const { useForm, Item } = Form;

export const ClassTemplates = () => {
  const { get, update, remove, create } = useTemplate();
  const { get: getCats } = useCategory();
  const [currentTemplate, setCurrentTemplate] = useState<ITemplate | null>(
    null
  );
  const [isDrawer, openDrawer] = useState(false);
  const [form] = useForm();

  const columns: TableProps<ITemplate>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (el) => `$${el}`
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time'
    },
    {
      title: 'Cat',
      dataIndex: 'categories',
      key: 'categories',
      render: (cats) => cats?.map((el: ICategory) => <Tag>{el.name}</Tag>)
    },
    {
      dataIndex: 'id',
      key: 'remove',
      align: 'center',
      render: (id, record) => (
        <DeleteIcon<ITemplate> remove={remove} id={id} name={record.name} />
      )
    }
  ];

  const handleFinish = async (values: Omit<ITemplate, 'id'>) => {
    if (currentTemplate) {
      await update.mutateAsync({ ...values, id: currentTemplate.id });
    } else {
      await create.mutateAsync(values);
    }
    closeDrawer();
  };

  const closeDrawer = () => {
    openDrawer(false);
    setCurrentTemplate(null);
    form.resetFields();
  };

  return (
    <>
      <Button block onClick={() => openDrawer(true)} type="primary">
        Create template
      </Button>
      <Table
        loading={get.isPending || create.isPending}
        rowKey={(el) => el.id}
        columns={columns}
        dataSource={get.data}
        size="small"
        pagination={false}
        onRow={(el) => ({
          onClick: () => {
            openDrawer(true);
            setCurrentTemplate(el);
            form.setFieldsValue({
              ...el,
              categories: el.categories?.map((el) => el.id)
            });
          }
        })}
      />
      <Drawer open={!!isDrawer} title="Template" onClose={closeDrawer}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            price: 0
          }}
        >
          <Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter template name' }]}
          >
            <Input placeholder="Enter template name" />
          </Item>

          <Item
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              style={{ width: '100%' }}
              placeholder="Enter price"
              prefix="$"
            />
          </Item>
          <Item
            label="Time"
            name="time"
            rules={[{ required: true, message: 'Please enter time' }]}
          >
            <Input type="time" />
          </Item>
          <Item label="Categories" name="categories">
            <Select
              mode="multiple"
              allowClear
              placeholder="Select categories"
              options={getCats.data?.map((cat) => ({
                value: cat.id,
                label: cat.name
              }))}
            />
          </Item>
          <Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={update.isPending || create.isPending}
            >
              {currentTemplate ? 'Update Template' : 'Create Template'}
            </Button>
          </Item>
        </Form>
      </Drawer>
    </>
  );
};
