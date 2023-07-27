import { useQuery } from '@tanstack/react-query';
import { Descriptions, Table, Tag, Typography } from 'antd';
import { IKeys, IRUser } from 'models';
import React, { useState } from 'react';
import { userService } from 'services';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { PaymentsProducts } from 'components';

const columns: ColumnsType<IRUser> = [
  { title: 'Students', key: 'name', render: (_, el) => `${el.first_name} ${el.last_name}` }
];

export const Students = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryFn: userService.getCustomers,
    queryKey: [IKeys.ORDERS, { page }],
    staleTime: 1000 * 60
  });

  return (
    <Table
      dataSource={data}
      columns={columns}
      loading={isLoading}
      rowKey={(line) => line.id}
      size="small"
      expandable={{
        expandedRowRender: (el) => (
          <Descriptions size="small">
            <Descriptions.Item label="Phone"><Typography.Link href={`tel:${el.acf.billing_phone}`}>{el.acf.billing_phone}</Typography.Link></Descriptions.Item>
            <Descriptions.Item label="Insta"><Typography.Paragraph style={{ marginBottom: 0 }} copyable={!!el.acf.instagram}>{el.acf.instagram}</Typography.Paragraph></Descriptions.Item>
            <Descriptions.Item label="Dob">{el.acf.dob && dayjs(el.acf.dob).format('MM/DD/YYYY')}</Descriptions.Item>
            <Descriptions.Item label="Email"><Typography.Link href={`tel:${el.email}`}>{el.email}</Typography.Link></Descriptions.Item>
          </Descriptions>
        )
      }}
    // pagination={{
    //   current: page,
    //   pageSize: 10,
    //   total: data?.headers['x-wp-total'],
    //   onChange: (number) => setPage(number)
    // }}
    />
  );
};