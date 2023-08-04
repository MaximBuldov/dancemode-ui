import { useQuery } from '@tanstack/react-query';
import { Descriptions, Divider, Input, Table, Typography } from 'antd';
import { IKeys, IRUser } from 'models';
import { useState } from 'react';
import { userService } from 'services';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import useDebounce from 'hooks/useDebounce';

const columns: ColumnsType<IRUser> = [
  { title: 'Students', key: 'name', render: (_, el) => `${el.first_name} ${el.last_name}` }
];

const pageSize = 30;

export const Students = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = useQuery({
    queryFn: () => userService.getCustomers({ search: debouncedSearch }),
    queryKey: [IKeys.CUSTOMERS, { page, name: debouncedSearch }],
    staleTime: 1000 * 60
  });

  return (
    <>
      <Input
        value={search}
        onChange={(val) => setSearch(val.target.value)}
        placeholder="Search by name"
      />
      <Divider />
      <Table
        dataSource={data?.data}
        columns={columns}
        loading={isLoading}
        rowKey={(line) => line.id}
        size="small"
        expandable={{
          expandedRowRender: (el) => el && (
            <Descriptions size="small">
              <Descriptions.Item label="Phone"><Typography.Link href={`tel:${el.acf.billing_phone}`}>{el.acf.billing_phone}</Typography.Link></Descriptions.Item>
              <Descriptions.Item label="Insta"><Typography.Paragraph style={{ marginBottom: 0 }} copyable={!!el.acf.instagram}>{el.acf.instagram}</Typography.Paragraph></Descriptions.Item>
              <Descriptions.Item label="Dob">{el.acf.dob && dayjs(el.acf.dob).format('MM/DD/YYYY')}</Descriptions.Item>
              <Descriptions.Item label="Email"><Typography.Link href={`tel:${el.email}`}>{el.email}</Typography.Link></Descriptions.Item>
            </Descriptions>
          )
        }}
        pagination={{
          current: page,
          pageSize,
          total: data?.headers['x-wp-total'],
          onChange: (number) => setPage(number)
        }}
      />
    </>
  );
};