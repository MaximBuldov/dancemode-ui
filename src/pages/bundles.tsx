import { DeleteOutlined, DeleteTwoTone } from '@ant-design/icons';
import { Button, Flex, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useBundle } from 'hooks/useBundle';
import { IBundle, IProduct } from 'models';

export const Bundles = () => {
  const { get, remove, update } = useBundle();

  const columns: ColumnsType<IBundle> = [
    {
      title: 'Classses',
      dataIndex: 'products',
      key: 'products',
      render: (products: IProduct[], record) => (
        <Flex gap="small" wrap>
          {products.map((el) => {
            const filtered = {
              id: record.id,
              products: products
                .filter((pr) => pr.id !== el.id)
                .map((el) => el.id)
            };
            return (
              <Tag
                color="blue"
                variant="outlined"
                key={`${record.id}-${el.id}`}
                closeIcon={<DeleteTwoTone />}
                onClose={(e) => {
                  e.preventDefault();
                  update.mutate(filtered);
                }}
                onClick={() => {
                  update.mutate(filtered);
                }}
              >
                {el.name} - {dayjs(el.date_time).format('MM/DD')}
              </Tag>
            );
          })}
        </Flex>
      )
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (el, record) => (
        <span
          onClick={() => {
            const discount = prompt('Update discount:', el);
            if (discount !== el) {
              update.mutate({
                id: record.id,
                discount: Number(discount)
              });
            }
          }}
        >
          ${el}
        </span>
      )
    },
    {
      dataIndex: 'id',
      key: 'actions',
      render: (id) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          type="text"
          onClick={() => remove.mutate(id)}
        />
      )
    }
  ];

  return (
    <>
      <Table
        dataSource={get?.data}
        columns={columns}
        loading={get.isFetching || remove.isPending || update.isPending}
        rowKey={(line) => line.id}
        size="small"
        pagination={false}
      />
    </>
  );
};
