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
  data: IProduct;
  isExpired: boolean;
  day: dayjs.Dayjs;
}

export const UnpaidClass = observer(({ data, isExpired, day }: UnpaidClassProps) => {
  const classTime = dayjs(day).hour(Number(data.time));
  const client = useQueryClient();
  const { contextHolder, onErrorFn } = useError();
  const product = useMemo(() => ({
    ...data,
    day: classTime.format('YYYYMMDD'),
    month: classTime.format('YYYYMM')
  }), [classTime, data]);

  const { mutate, isLoading } = useMutation({
    mutationFn: orderService.create,
    onError: onErrorFn,
    onSuccess: (data) => {
      client.setQueriesData(
        [IKeys.ORDERS, { month: dayjs(day).month() }],
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
              checked={cartStore.isProductInCart(product)}
              onChange={() => cartStore.isProductInCart(product) ? cartStore.removeFromCart(product) : cartStore.addSingleProduct(product)}
            />
            <Typography>{data.name}: {classTime.format('ha')}</Typography>
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