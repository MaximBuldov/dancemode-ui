import { CloseCircleOutlined, CheckCircleOutlined, DollarOutlined, MoreOutlined } from '@ant-design/icons';
import { MenuProps, Typography, Spin, Row, Col, Space, Checkbox, Tag, Dropdown } from 'antd';
import dayjs from 'dayjs';
import { useUpdateOrder } from 'hooks';
import { observer } from 'mobx-react-lite';
import { IMetaData, IProduct, IStatus, IStatusValue } from 'models';
import { useMemo } from 'react';

interface PaidClassProps {
  product: IProduct;
  isExpired: boolean;
  order: number;
  meta_data: IMetaData[];
  item_id: number;
}

export const PaidClass = observer(({ product, isExpired, order, meta_data, item_id }: PaidClassProps) => {
  const classTime = dayjs(product.date_time);

  const isConfirmed = meta_data?.some(el => el.key === IStatus.CONFIRM && el.value === IStatusValue.TRUE);
  const isCanceled = meta_data?.some(el => el.key === IStatus.CANCEL && el.value === IStatusValue.TRUE);

  const { mutate, contextHolder, isLoading } = useUpdateOrder(product, order, item_id);

  const items = useMemo(() => {
    const elements: MenuProps['items'] = [];

    if (!isCanceled) {
      elements.push({
        label: <Typography.Text type="danger"><CloseCircleOutlined /> Cancel</Typography.Text>,
        key: 'cancel',
        onClick: () => mutate({ key: IStatus.CANCEL, value: IStatusValue.TRUE })
      });
    }

    if (!isConfirmed && !isCanceled) {
      elements.push({
        label: <Typography.Text type="success"><CheckCircleOutlined /> Confirm</Typography.Text>,
        key: 'Confirm',
        onClick: () => mutate({ key: IStatus.CONFIRM, value: IStatusValue.TRUE })
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