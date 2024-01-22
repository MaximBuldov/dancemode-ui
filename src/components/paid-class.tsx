import { CloseCircleOutlined, CheckCircleOutlined, DollarOutlined, MoreOutlined } from '@ant-design/icons';
import { MenuProps, Typography, Spin, Row, Col, Space, Checkbox, Tag, Dropdown } from 'antd';
import dayjs from 'dayjs';
import { useProductStatusUpdate } from 'hooks';
import { observer } from 'mobx-react-lite';
import { IProduct, IStatus } from 'models';
import { useMemo } from 'react';
import { userStore } from 'stores';

interface PaidClassProps {
  product: IProduct;
  isExpired: boolean;
  price: number;
}

export const PaidClass = observer(({ product, isExpired, price }: PaidClassProps) => {
  const classTime = dayjs(product.date_time);
  const userId = userStore.data!.id;
  const { mutate, isLoading, contextHolder } = useProductStatusUpdate(classTime, userId, price, product.id);

  const isConfirmed = Array.isArray(product.confirm) && product.confirm.includes(userId);
  const isCanceled = Array.isArray(product.cancel) && product.cancel.includes(userId);

  const items = useMemo(() => {
    const elements: MenuProps['items'] = [];

    if (!isCanceled) {
      elements.push({
        label: <Typography.Text type="danger"><CloseCircleOutlined /> Cancel</Typography.Text>,
        key: 'cancel',
        onClick: () => mutate({ key: IStatus.CANCEL })
      });
    }

    if (!isConfirmed && !isCanceled) {
      elements.push({
        label: <Typography.Text type="success"><CheckCircleOutlined /> Confirm</Typography.Text>,
        key: 'Confirm',
        onClick: () => mutate({ key: IStatus.CONFIRM })
      });
    }

    return elements;
  }, [isCanceled, isConfirmed, mutate]);

  return (
    <Spin spinning={isLoading}>
      <Row justify="space-between">
        <Col>
          <Space>
            <Checkbox disabled />
            <Typography>{product.name}: {classTime.format('ha')}</Typography>
            <div>
              <Tag icon={<DollarOutlined />} color="processing">Payed</Tag>
              {(isConfirmed && !isCanceled) && <Tag icon={<CheckCircleOutlined />} color="success">Confirmed</Tag>}
              {isCanceled && <Tag icon={<CloseCircleOutlined />} color="error">Canceled</Tag>}
            </div>
          </Space>
        </Col>
        {(!isExpired && !!items.length) && (
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
        {contextHolder}
      </Row>
    </Spin>
  );
});