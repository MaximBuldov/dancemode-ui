import { useQuery } from '@tanstack/react-query';
import { Table } from 'antd';
import { IKeys, IMakeUp } from 'models';
import { makeupService } from 'services';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const columns: ColumnsType<IMakeUp> = [
  {
    title: 'Class', key: 'class',
    render: (_, record) => `${record.acf.class_name}: ${dayjs(record.acf.origin).format('MMM D')}`
  },
  { title: 'Deadline', dataIndex: ['acf', 'deadline'], key: 'deadline', render: (el) => dayjs(el).format('MMM D') }
];

export const Makeups = () => {
  const { data, isFetching } = useQuery({
    queryFn: makeupService.getCurrent,
    queryKey: [IKeys.MAKEUPS],
    staleTime: 1000 * 60
  });

  return (
    <Table
      dataSource={data}
      columns={columns}
      loading={isFetching}
      rowKey={(line) => line.id}
      size="small"
      pagination={false}
    />
  );
};