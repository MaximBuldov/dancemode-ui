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
import { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { IKeys, IProduct, IRUser, IStatus, IUserWithStatus } from 'models';
import { Key, useMemo, useState } from 'react';
import { productService } from 'services';

import { ProductForm } from './product-form';

interface TeacherClassProps {
  product: IProduct;
}

export const TeacherClass = observer(({ product }: TeacherClassProps) => {
  const { date_time, paid, cancel, pending, confirm, wait_list } = product;
  const classTime = dayjs(date_time);
  const isExpired = dayjs().isAfter(classTime, 'day');
  const client = useQueryClient();
  const [modal, setModal] = useState(false);
  const [customersTable, openCustomersTable] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Key[]>([]);
  const allCustomers = client.getQueryData<AxiosResponse<IRUser[]>>([
    IKeys.CUSTOMERS
  ])?.data;

  const customers = useMemo(() => {
    const paidCustomersId = [...paid, ...pending, ...wait_list];
    return (
      allCustomers?.reduce((res: IUserWithStatus[], customer) => {
        const id = customer.id;
        if (paidCustomersId.includes(id)) {
          res.push({
            ...customer,
            paid: paid.includes(id),
            status: confirm.includes(id)
              ? IStatus.CONFIRM
              : cancel.includes(id)
                ? IStatus.CANCEL
                : wait_list.includes(id)
                  ? IStatus.WAIT_LIST
                  : undefined
          });
        }
        return res;
      }, []) || []
    );
  }, [allCustomers, cancel, confirm, paid, pending, wait_list]);

  const updateProduct = useMutation({
    mutationFn: (data: any) => productService.update(data, product.id),
    onSuccess: (data) => {
      client.setQueryData(
        [IKeys.PRODUCTS, { month: classTime.format('YYYY-MM') }],
        (products: IProduct[] | undefined) =>
          products
            ? products.map((el) => (el.id === data.id ? data : el))
            : products
      );
      setModal(false);
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
      render: (_, el) => `${el.first_name} ${el.last_name}`
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (el) => {
        if (el === IStatus.CONFIRM) {
          return <Tag color="green">Confirmed</Tag>;
        }
        if (el === IStatus.CANCEL) {
          return <Tag color="red">Canceled</Tag>;
        }
        if (el === IStatus.WAIT_LIST) {
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

  const updateCustomersStatus = (status: IStatus) => {
    let newConfirm;
    let newCancel;

    if (status === IStatus.CONFIRM) {
      newConfirm = new Set([...confirm, ...selectedRows]);
      newCancel = cancel.filter((el) => !selectedRows.includes(el));
    }

    if (status === IStatus.CANCEL) {
      newCancel = new Set([...cancel, ...selectedRows]);
      newConfirm = confirm.filter((el) => !selectedRows.includes(el));
    }

    updateProduct.mutate({
      confirm: Array.from(newConfirm || []),
      cancel: Array.from(newCancel || [])
    });
  };

  return (
    <Spin spinning={updateProduct.isPending || deleteProduct.isPending}>
      <Row justify="space-between">
        <Col onClick={() => openCustomersTable((prev) => !prev)}>
          <Space>
            {<CaretRightOutlined rotate={customersTable ? 90 : 0} />}
            <Typography>
              {product.name}: {classTime.format('ha')} ({confirm.length}/
              {customers.length})
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
          <Table
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
                onClick={() => updateCustomersStatus(IStatus.CONFIRM)}
              >
                Confirm
              </Button>
              <Button
                type="primary"
                danger
                onClick={() => updateCustomersStatus(IStatus.CANCEL)}
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
            regular_price: product.price,
            date_time: classTime.format('YYYY-MM-DDTHH:MM'),
            stock_quantity: product.stock_quantity
          }}
        />
      </Drawer>
    </Spin>
  );
});
