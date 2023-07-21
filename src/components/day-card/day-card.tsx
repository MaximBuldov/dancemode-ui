import { Badge, Card, Space, Typography } from 'antd';
import classNames from 'classnames';
import { SingleClass } from 'components';
import dayjs from 'dayjs';
import { productStore } from 'stores';
import { IROrderProduct } from 'models';
import { observer } from 'mobx-react-lite';

import styles from './day-card.module.scss';

interface DayCardProps {
  day: dayjs.Dayjs;
  data?: IROrderProduct[];
}

export const DayCard = observer(({ day, data }: DayCardProps) => {
  const isExpired = dayjs().isAfter(day, 'day');
  const isJaneCanceled = false;

  return (
    <Badge.Ribbon
      text="Canceled by Jane"
      color="red"
      className={classNames({ [styles['badge-hide']]: !isJaneCanceled })}
    >
      <Card size="small" title={renderTitle()}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {productStore.data && productStore.data?.map(el =>
            <SingleClass
              data={el}
              isExpired={isExpired || isJaneCanceled}
              key={el.id}
              day={day}
              status={data?.find(item => item.product_id === el.id)}
            />
          )}
        </Space>
      </Card>
    </Badge.Ribbon>
  );

  function renderTitle() {
    return <Typography.Text delete={isExpired} disabled={isJaneCanceled}>{dayjs(day).format('MMMM D')}</Typography.Text>;
  }
});