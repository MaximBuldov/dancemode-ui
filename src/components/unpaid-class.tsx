import { ClockCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MenuProps, Typography, Dropdown, Checkbox, Col, Row, Space, Spin } from 'antd';
import dayjs from 'dayjs';
import { useError } from 'hooks';
import { observer } from 'mobx-react-lite';
import { IKeys, IProduct, IROrder, IStatus, IStatusValue } from 'models';
import { useMemo } from 'react';
import { makeupService, orderService } from 'services';
import { makeupStore, cartStore } from 'stores';
import { prepareOrder } from 'utils';

interface UnpaidClassProps {
  product: IProduct;
  isExpired: boolean;
}

export const UnpaidClass = observer(({ product, isExpired }: UnpaidClassProps) => {
  const classTime = dayjs(product.date_time);
  const client = useQueryClient();
  const { contextHolder, onErrorFn } = useError();

  const { mutate, isLoading } = useMutation({
    mutationFn: orderService.create,
    onError: onErrorFn,
    onSuccess: (data) => {
      client.setQueriesData(
        [IKeys.ORDERS, { month: classTime.format('YYYY-MM') }],
        (orders: IROrder[] | undefined) => orders ? [...orders, data] : orders
      );
      updateMakeup.mutate(data.id);
    }
  });

  const updateMakeup = useMutation({
    mutationFn: (id: number) => makeupService.update({ acf: { make_up: classTime.format('YYYYMMDD'), order: id } }, makeupStore.oldestId),
    onError: onErrorFn,
    onSuccess: (data) => {
      makeupStore.removeMakeup(data.id);
    }
  });

  const items = useMemo(() => {
    const elements: MenuProps['items'] = [];

    if (makeupStore.checkAvailable(classTime)) {
      elements.push({
        label: <Typography.Text type="warning"><ClockCircleOutlined /> Reschedule</Typography.Text>,
        key: 'reschedule',
        onClick: () => mutate(prepareOrder([product], [{ key: IStatus.RESCHEDULE, value: IStatusValue.TRUE }], true))
      });
    }

    return elements;
  }, [classTime, mutate, product]);

  return (
    <Spin spinning={isLoading || updateMakeup.isLoading}>
      <Row justify="space-between">
        <Col>
          <Space>
            <Checkbox
              disabled={isExpired}
              checked={cartStore.isInCart(product)}
              onChange={() => cartStore.isInCart(product) ? cartStore.remove(product) : cartStore.add(product)}
            />
            <Typography>{product.name}: {classTime.format('ha')}</Typography>
          </Space>
        </Col>
        {(!!items.length && !isExpired) && (
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
      {contextHolder}
    </Spin>
  );
});