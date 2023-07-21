import { CloseCircleOutlined, ClockCircleOutlined, CheckCircleOutlined, DollarOutlined, MoreOutlined } from '@ant-design/icons';
import { MenuProps, Typography, Spin, Row, Col, Space, Checkbox, Tag, Dropdown } from 'antd';
import dayjs from 'dayjs';
import { useUpdateOrder } from 'hooks';
import { observer } from 'mobx-react-lite';
import { IProduct, IROrderProduct, IStatus, IStatusValue } from 'models';
import { useMemo } from 'react';

interface PaidClassProps {
  data: IProduct;
  isExpired: boolean;
  day: dayjs.Dayjs;
  status: IROrderProduct;
}

export const PaidClass = observer(({ data, isExpired, day, status }: PaidClassProps) => {
  const classTime = dayjs(day).hour(Number(data.time));
  const isDeadline = dayjs().isBefore(classTime.subtract(5, 'hour')); //true - you get free class

  const isConfirmed = status?.meta_data.some(el => el.key === IStatus.CONFIRM && el.value === IStatusValue.TRUE);
  const isCanceled = status?.meta_data.some(el => el.key === IStatus.CANCEL && el.value === IStatusValue.TRUE);
  const isRescheduled = status?.meta_data.some(el => el.key === IStatus.RESCHEDULE && el.value === IStatusValue.TRUE);

  const { mutate, contextHolder, isLoading } = useUpdateOrder(day, isDeadline, status);

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
            <Typography>{data.name}: {classTime.format('ha')}</Typography>
            <div>
              {!isRescheduled && <Tag icon={<DollarOutlined />} color="processing">Payed</Tag>}
              {isRescheduled && <Tag icon={<ClockCircleOutlined />} color="warning">Rescheduled</Tag>}
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