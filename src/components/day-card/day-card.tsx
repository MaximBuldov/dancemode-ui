import { Badge, Card, Space, Typography } from 'antd';
import classNames from 'classnames';
import { SingleClass } from 'components';
import dayjs from 'dayjs';
import { IProduct, IROrder } from 'models';
import { observer } from 'mobx-react-lite';
import { userStore } from 'stores';
import { FrownTwoTone } from '@ant-design/icons';

import styles from './day-card.module.scss';

interface DayCardProps {
  day: string;
  payedClasses?: number[];
  classes?: IProduct[];
  orders?: IROrder[];
}

export const DayCard = observer(({ day, payedClasses, classes, orders }: DayCardProps) => {
  const isExpired = dayjs().isAfter(day, 'day');
  const isJaneCanceled = classes?.every(el => el.is_canceled);

  return (
    <Badge.Ribbon
      text={userStore.isAdmin ? 'Canceled whole day' : 'Canceled by Jane'}
      color="red"
      className={classNames({ [styles['badge-hide']]: !isJaneCanceled })}
    >
      <Card size="small" title={renderTitle()}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {classes?.map(el =>
            <div key={el.id} className={classNames({ [styles['canceled']]: el.is_canceled && !userStore.isAdmin })}>
              <SingleClass
                product={el}
                isExpired={isExpired || !!isJaneCanceled || el.is_canceled}
                isPaid={!!payedClasses?.includes(el.id)}
                price={productTotal(el)}
              />
              {(el.is_canceled && !userStore.isAdmin) && <div className={styles['canceled-text']}><FrownTwoTone twoToneColor="#ff5500" /> Canceled</div>}
            </div>
          )}
        </Space>
      </Card>
    </Badge.Ribbon>
  );

  function renderTitle() {
    return <Typography.Text delete={isExpired} disabled={isJaneCanceled}>{dayjs(day).format('MMMM D')}</Typography.Text>;
  }

  function productTotal(el: IProduct) {
    return orders?.reduce((total, order) => {
      const matchingItem = order.line_items.find(item => item.product_id === el.id);
      return matchingItem ? Number(matchingItem.total) : total;
    }, 0) || 0;
  }
});