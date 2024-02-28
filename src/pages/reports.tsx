import { useInfiniteQuery } from '@tanstack/react-query';
import { Button, Divider, Table, TableProps } from 'antd';
import dayjs from 'dayjs';
import { IKeys, IOrderStatus, IReport } from 'models';
import { orderService } from 'services';
import { createReport } from 'utils';

const columns: TableProps<IReport>['columns'] = [
  {
    title: 'Month',
    key: 'group',
    dataIndex: 'group',
    align: 'center',
    render: (el) => dayjs(el).format('MMM YY')
  },
  {
    title: 'Cash',
    key: 'cash',
    dataIndex: 'cash',
    align: 'center',
    render: (el) => `$${el}`
  },
  {
    title: 'Card',
    key: 'card',
    dataIndex: 'card',
    align: 'center',
    render: (el) => `$${el}`
  },
  {
    title: 'Rev',
    key: 'revenue',
    dataIndex: 'revenue',
    align: 'center',
    render: (el) => <b>${el}</b>
  },
  {
    title: 'Profit',
    key: 'profit',
    dataIndex: 'profit',
    align: 'center',
    render: (el) => <b>${el}</b>
  },
  {
    title: 'Beg',
    key: 'beginners',
    align: 'center',
    dataIndex: 'beginners'
  },
  {
    title: 'Adv',
    key: 'adv',
    align: 'center',
    dataIndex: 'adv'
  },
  {
    title: 'Total',
    key: 'total',
    dataIndex: 'totalStudents',
    align: 'center',
    render: (el) => <b>{el}</b>
  }
];

const { Summary: { Row, Cell } } = Table;

export const Reports = () => {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isPending } = useInfiniteQuery({
    queryKey: [IKeys.ORDERS],
    queryFn: ({ pageParam }) => orderService.getAll({
      per_page: 100,
      status: [IOrderStatus.PENDING, IOrderStatus.COMPLETED],
      min_date: dayjs().subtract((pageParam + 3), 'month').format('YYYY-MM'),
      max_date: dayjs().subtract(pageParam, 'month').format('YYYY-MM')
    }),
    select: (res) => {
      return createReport(res.pages.flatMap(page => page.data));
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.data.length > 0) {
        return lastPageParam + 3;
      }
    }
  });

  return (
    <>
      <Table
        dataSource={data}
        columns={columns}
        loading={isPending}
        pagination={false}
        rowKey={(el) => el.group}
        size="small"
        bordered
        summary={(pageData) => {
          let totalCash = 0;
          let totalCard = 0;
          let totalRev = 0;
          let totalProf = 0;
          let totalBeg = 0;
          let totalAdv = 0;
          let totalStu = 0;

          pageData.forEach(({ card, cash, profit, revenue, adv, beginners, totalStudents }) => {
            totalCash += cash;
            totalCard += card;
            totalRev += revenue;
            totalProf += profit;
            totalBeg += beginners;
            totalAdv += adv;
            totalStu += totalStudents;
          });

          return (
            <Row style={{ backgroundColor: '#fafafa' }}>
              <Cell index={0}><b>Total:</b></Cell>
              <Cell align="center" index={1}>${totalCash}</Cell>
              <Cell align="center" index={2}>${totalCard}</Cell>
              <Cell align="center" index={3}><b>${totalRev}</b></Cell>
              <Cell align="center" index={4}><b>${totalProf}</b></Cell>
              <Cell align="center" index={5}>{totalBeg}</Cell>
              <Cell align="center" index={6}>{totalAdv}</Cell>
              <Cell align="center" index={7}><b>{totalStu}</b></Cell>
            </Row>
          );
        }}
      />
      <Divider />
      <Button
        block
        type="primary"
        loading={isFetchingNextPage}
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage}
      >
        Load more
      </Button>
    </>
  );
};