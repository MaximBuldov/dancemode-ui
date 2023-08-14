import { CloseCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MenuProps, Typography, Dropdown, Col, Row, Spin, Tag, Space, Modal, Table } from 'antd';
import dayjs from 'dayjs';
import { useError } from 'hooks';
import { observer } from 'mobx-react-lite';
import { IKeys, IProduct, IROrder, IStatus, IStatusValue } from 'models';
import { useMemo, useState } from 'react';
import { orderService, productService } from 'services';
import { ColumnsType } from 'antd/es/table';

import { ProductForm } from './product-form';

interface TeacherClassProps {
  product: IProduct;
}

export const TeacherClass = observer(({ product }: TeacherClassProps) => {
  const classTime = dayjs(product.date_time);
  const isExpired = dayjs().isAfter(classTime, 'day');
  const client = useQueryClient();
  const [modal, setModal] = useState(false);
  const { contextHolder, onErrorFn } = useError();

  const productApi = useMutation({
    mutationFn: (data: any) => productService.update(data, product.id),
    onError: onErrorFn,
    onSuccess: (data) => {
      client.setQueriesData(
        [IKeys.PRODUCTS, { month: classTime.format('YYYY-MM') }],
        (products: IProduct[] | undefined) => products ? products.map(el => el.id === data.id ? data : el) : products
      );
      setModal(false);
    }
  });

  const orderApi = useMutation({
    mutationFn: () => orderService.getAll({ per_page: 100, product: product.id }),
    onError: onErrorFn
  });
  const orders = orderApi.data?.data;

  const items = useMemo(() => {
    const elements: MenuProps['items'] = [
      {
        label: product.is_canceled ? 'Undo cancel' : 'Cancel',
        key: 'cancel',
        onClick: () => productApi.mutate({ is_canceled: !product.is_canceled })
      },
      {
        label: 'Edit',
        key: 'edit',
        onClick: () => setModal(true)
      }
    ];

    return elements;
  }, [product.is_canceled, productApi]);

  const columns: ColumnsType<IROrder> = [
    {
      title: 'Name',
      dataIndex: 'customer_name',
      key: 'name'
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, el) => {
        const meta = el.line_items.find(item => item.product_id === product.id)?.meta_data;
        const isConfirm = meta?.some(el => el.key === IStatus.CONFIRM && el.value === IStatusValue.TRUE);
        const isCanceled = meta?.some(el => el.key === IStatus.CANCEL && el.value === IStatusValue.TRUE);
        if (isConfirm) {
          return <Tag color="green">Confirmed</Tag>;
        }
        if (isCanceled) {
          return <Tag color="red">Canceled</Tag>;
        }
        return '';
      }
    }
  ];

  return (
    <Spin spinning={productApi.isLoading || orderApi.isLoading}>
      <Row justify="space-between">
        <Col>
          <Space>
            <Typography onClick={() => orderApi.mutate()}>
              {product.name}: {classTime.format('ha')}
            </Typography>
            {product.is_canceled && <Tag icon={<CloseCircleOutlined />} color="error">Canceled</Tag>}
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
      {orders && orders.length > 0 && (
        <Table
          dataSource={orders}
          rowKey={(el) => el.id}
          size="small"
          columns={columns}
          pagination={false}
        />
      )}
      <Modal title="Edit class" open={modal} footer={false} onCancel={() => setModal(false)}>
        <ProductForm onFinish={(values) => productApi.mutate(values)} isLoading={productApi.isLoading} initialValues={{ name: product.name, regular_price: product.price, date_time: classTime.format('YYYY-MM-DDTHH:MM') }} />
      </Modal>
      {contextHolder}
    </Spin>
  );
});