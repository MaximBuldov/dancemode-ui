import { FrownTwoTone } from '@ant-design/icons';
import { Badge, Card, Space, Typography } from 'antd';
import classNames from 'classnames';
import { SingleClass } from 'components';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { IProduct } from 'models';
import { userStore } from 'stores';

import styles from './day-card.module.scss';

interface DayCardProps {
  day: string;
  classes?: IProduct[];
}

export const DayCard = observer(({ day, classes }: DayCardProps) => {
  const isExpired = dayjs().isAfter(day, 'day');
  const isJaneCanceled = classes?.every((el) => el.is_canceled);

  return (
    <Badge.Ribbon
      text={userStore.isAdmin ? 'Canceled whole day' : 'Canceled by Jane'}
      color="red"
      className={classNames({ [styles['badge-hide']]: !isJaneCanceled })}
    >
      <Card size="small" title={renderTitle()}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {classes?.map((el) => (
            <div
              key={el.id}
              className={classNames({
                [styles['canceled']]: el.is_canceled && !userStore.isAdmin
              })}
            >
              <SingleClass
                product={el}
                isExpired={isExpired || !!isJaneCanceled || el.is_canceled}
              />
              {el.is_canceled && !userStore.isAdmin && (
                <div className={styles['canceled-text']}>
                  <FrownTwoTone twoToneColor="#ff5500" /> Canceled
                </div>
              )}
            </div>
          ))}
        </Space>
      </Card>
    </Badge.Ribbon>
  );

  function renderTitle() {
    return (
      <Typography.Text delete={isExpired} disabled={isJaneCanceled}>
        {dayjs(day).format('MMMM D - dddd')}
      </Typography.Text>
    );
  }
});
