import { Badge, Card, Space, Typography } from 'antd';
import classNames from 'classnames';
import { SingleClass } from 'components';
import dayjs from 'dayjs';
import { IProduct, IROrder } from 'models';
import { observer } from 'mobx-react-lite';

import styles from './day-card.module.scss';

interface DayCardProps {
  day: string;
  orders?: IROrder[];
  classes?: IProduct[];
}

export const DayCard = observer(({ day, orders, classes }: DayCardProps) => {
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
          {classes?.map(el =>
            <SingleClass
              product={el}
              isExpired={isExpired || isJaneCanceled}
              key={el.id}
              order={findStatus(el)?.order}
              meta_data={findStatus(el)?.meta_data}
              item_id={findStatus(el)?.item_id}
            />
          )}
        </Space>
      </Card>
    </Badge.Ribbon>
  );

  function renderTitle() {
    return <Typography.Text delete={isExpired} disabled={isJaneCanceled}>{dayjs(day).format('MMMM D')}</Typography.Text>;
  }

  function findStatus(product: IProduct) {
    if (orders) {
      for (const order of orders) {
        const itemInOrder = order.line_items?.find(item => item.product_id === product.id);
        if (itemInOrder) {
          return { order: order.id, meta_data: itemInOrder.meta_data, item_id: itemInOrder.id };
        }
      }
    }
  }
});