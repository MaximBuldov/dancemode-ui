import { useQuery } from '@tanstack/react-query';
import { Descriptions, Divider, Input, Table, Typography } from 'antd';
import { IKeys, IRUser, IUser } from 'models';
import { useState } from 'react';
import { userService } from 'services';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import useDebounce from 'hooks/useDebounce';

const columns: ColumnsType<IRUser> = [
  { title: 'Students', key: 'name', render: (_, el) => `${el.first_name} ${el.last_name}` },
  { title: 'DOB', key: 'dob', dataIndex: ['acf', 'dob'], render: (el) => dayjs(el).format('MM/DD/YY') }
];

const pageSize = 100;

export const Students = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = useQuery({
    queryFn: () => userService.getCustomers({
      search: debouncedSearch,
      per_page: 100
    }),
    select: (data) => {
      return {
        ...data,
        data: data.data.sort(compareBirthdays)
      };
    },
    queryKey: [IKeys.CUSTOMERS, { name: debouncedSearch }],
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

function compareBirthdays(user1: IUser, user2: IRUser) {
  const birthday1 = dayjs(user1.acf.dob);
  const birthday2 = dayjs(user2.acf.dob);

  if (birthday1.isBefore(birthday2, 'day')) {
    return -1;
  } else if (birthday1.isAfter(birthday2, 'day')) {
    return 1;
  } else {
    return 0;
  }
}