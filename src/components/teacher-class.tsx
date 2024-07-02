import {
  CaretRightOutlined,
  CloseCircleOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Col,
  Drawer,
  Dropdown,
  Flex,
  MenuProps,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Typography
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import {
  IKeys,
  IOrderProduct,
  IOrderStatus,
  IProduct,
  IProductStatus,
  IUserWithStatus
} from 'models';
import { Key, useMemo, useState } from 'react';
import { orderProductService, productService } from 'services';

import { ProductForm } from './product-form';

interface TeacherClassProps {
  product: IProduct;
}

export const TeacherClass = observer(({ product }: TeacherClassProps) => {
  const { date_time } = product;
  const classTime = dayjs(date_time);
  const isExpired = dayjs().isAfter(classTime, 'day');
  const client = useQueryClient();
  const [modal, setModal] = useState(false);
  const [customersTable, openCustomersTable] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Key[]>([]);

  const confirmed = useMemo(
    () =>
      product.orders.filter(
        (el) => el.productStatus === IProductStatus.CONFIRMED
      ),
    [product.orders]
  );

  const customers = useMemo(
    () =>
      product.orders.map((el) => ({
        id: el.id,
        name: `${el.user.first_name} ${el.user.last_name}`,
        paid: el.order.status === IOrderStatus.COMPLETED,
        status: el.productStatus
      })) as IUserWithStatus[],
    [product.orders]
  );

  const updateProduct = useMutation({
    mutationFn: (data: any) => productService.update(data, product.id),
    onSuccess: (data) => {
      client.setQueryData(
        [IKeys.PRODUCTS, { month: classTime.format('YYYY-MM') }],
        (products: IProduct[] | undefined) =>
          products
            ? products.map((el) =>
                el.id === data.id ? { ...el, ...data } : el
              )
            : products
      );
      setModal(false);
    }
  });

  const updateOrderProduct = useMutation({
    mutationFn: (data: Pick<IOrderProduct, 'productStatus'>) =>
      orderProductService.updateMany(data, selectedRows),
    onSuccess: (_, values) => {
      client.setQueryData(
        [IKeys.PRODUCTS, { month: classTime.format('YYYY-MM') }],
        (products: IProduct[] | undefined) =>
          products?.map((el) =>
            el.id === product.id
              ? {
                  ...el,
                  orders: el.orders.map((order) =>
                    selectedRows.includes(order.id)
                      ? {
                          ...order,
                          productStatus: values.productStatus
                        }
                      : order
                  )
                }
              : el
          )
      );
      setSelectedRows([]);
    }
  });

  const deleteProduct = useMutation({
    mutationFn: () => productService.delete(product.id),
    onSuccess: (data) => {
      client.setQueryData(
        [IKeys.PRODUCTS, { month: classTime.format('YYYY-MM') }],
        (products: IProduct[] | undefined) =>
          products ? products.filter((el) => el.id !== data.id) : products
      );
      setModal(false);
    }
  });

  const items = useMemo(() => {
    const elements: MenuProps['items'] = [
      {
        label: product.is_canceled ? 'Undo cancel' : 'Cancel',
        key: 'cancel',
        onClick: () =>
          updateProduct.mutate({ is_canceled: !product.is_canceled })
      },
      {
        label: 'Edit',
        key: 'edit',
        onClick: () => setModal(true)
      },
      {
        label: 'Delete',
        key: 'delete',
        onClick: () => deleteProduct.mutate()
      }
    ];

    return elements;
  }, [deleteProduct, product.is_canceled, updateProduct]);

  const columns: ColumnsType<IUserWithStatus> = [
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (el) => {
        if (el === IProductStatus.CONFIRMED) {
          return <Tag color="green">Confirmed</Tag>;
        }
        if (el === IProductStatus.CANCELED) {
          return <Tag color="red">Canceled</Tag>;
        }
        if (el === IProductStatus.WAIT_LIST) {
          return <Tag color="red">Wait list</Tag>;
        }
        return '';
      }
    },
    {
      title: 'Paid',
      key: 'paid',
      dataIndex: 'paid',
      render: (el) => el && '✅'
    }
  ];

  return (
    <Spin spinning={updateProduct.isPending || deleteProduct.isPending}>
      <Row justify="space-between">
        <Col onClick={() => openCustomersTable((prev) => !prev)}>
          <Space>
            {<CaretRightOutlined rotate={customersTable ? 90 : 0} />}
            <Typography>
              {product.name}: {classTime.format('ha')} ({confirmed.length}/
              {product.orders.length})
            </Typography>
            {product.is_canceled && (
              <Tag icon={<CloseCircleOutlined />} color="error">
                Canceled
              </Tag>
            )}
          </Space>
        </Col>
        {!isExpired && (
          <Col>
            <Dropdown
              menu={{ items }}
              trigger={['click']}
              placement="bottomRight"
            >
              <MoreOutlined />
            </Dropdown>
          </Col>
        )}
      </Row>
      {customersTable && (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Table<IUserWithStatus>
            dataSource={customers}
            rowKey={(el) => el.id}
            size="small"
            columns={columns}
            pagination={false}
            rowSelection={{
              hideSelectAll: true,
              selectedRowKeys: selectedRows,
              onChange: (arr) => setSelectedRows(arr)
            }}
          />
          {!!selectedRows.length && (
            <Flex wrap="wrap" gap="small">
              <Button
                type="primary"
                onClick={() =>
                  updateOrderProduct.mutate({
                    productStatus: IProductStatus.CONFIRMED
                  })
                }
              >
                Confirm
              </Button>
              <Button
                type="primary"
                danger
                onClick={() =>
                  updateOrderProduct.mutate({
                    productStatus: IProductStatus.CANCELED
                  })
                }
              >
                Cancel
              </Button>
            </Flex>
          )}
        </Space>
      )}
      <Drawer
        title="Edit class"
        open={modal}
        footer={false}
        onClose={() => setModal(false)}
      >
        <ProductForm
          onFinish={(values) => updateProduct.mutate(values)}
          isPending={updateProduct.isPending}
          initialValues={{
            name: product.name,
            price: product.price,
            date_time: classTime.toDate(),
            stock_quantity: product.stock_quantity,
            category_id: product.category_id
          }}
        />
      </Drawer>
    </Spin>
  );
});
