import { Descriptions, DescriptionsProps, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { ICoupon } from 'models';

interface CouponDescriptionProps {
  el: ICoupon;
}

export const CouponDescription = ({ el }: CouponDescriptionProps) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 'cats',
      label: 'Allowed categories',
      children: (
        <Space>
          {el.allowed_cat?.map((el) => (
            <Tag color="blue">{el.name}</Tag>
          ))}
        </Space>
      )
    },
    {
      key: 'users',
      label: 'Allowed Users',
      children: (
        <Space>
          {el.allowed_users.length > 0 ? (
            el.allowed_users?.map((el) => (
              <Tag color="geekblue">{`${el.first_name} ${el.last_name}`}</Tag>
            ))
          ) : (
            <Tag color="geekblue-inverse">Public</Tag>
          )}
        </Space>
      )
    },
    {
      key: 'expired',
      label: 'Expiry date',
      children: dayjs(el.date_expires).format('MM/DD/YYYY')
    },
    {
      key: 'desc',
      label: 'Description',
      children: el.description
    }
  ];
  return <Descriptions size="small" items={items} />;
};
