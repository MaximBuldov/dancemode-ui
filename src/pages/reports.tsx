import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Table, TableProps } from 'antd';
import { ReportCosts, ReportCostsForm, ReportSummary } from 'components';
import dayjs from 'dayjs';
import { useGetReports } from 'hooks/useGetReports';
import { IReport } from 'models';

const columns: TableProps<IReport>['columns'] = [
  {
    key: 'date',
    dataIndex: 'date',
    align: 'center',
    fixed: 'left',
    render: (el) => dayjs(el).format('MM/YY')
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
    title: 'Prof',
    key: 'profit',
    dataIndex: 'profit',
    align: 'center',
    render: (el) => el !== 0 ? <b>${el}</b> : 'N/A'
  },
  {
    title: 'Beg',
    key: 'beginners',
    align: 'center',
    dataIndex: 'beg'
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
    dataIndex: 'students',
    align: 'center',
    render: (el) => <b>{el}</b>
  }
];

const minDate = dayjs().startOf('year').format('YYYY-MM');
const maxDate = dayjs().format('YYYY-MM');

export const Reports = () => {
  const [form] = Form.useForm();
  const { data, isPending } = useGetReports({ from: minDate, to: maxDate });

  return (
    <>
      <Form
        form={form}
        initialValues={{
          from: minDate,
          to: dayjs().format('YYYY-MM')
        }}
      >
        <Space.Compact>
          <Form.Item name="from">
            <Input
              type="month"
              addonBefore="From"
              min={minDate}
              max={maxDate}
            />
          </Form.Item>
          <Form.Item name="to">
            <Input
              type="month"
              addonBefore="to"
              min={minDate}
              max={maxDate}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />} />
        </Space.Compact>
      </Form>
      <Table
        dataSource={data}
        columns={columns}
        loading={isPending}
        pagination={false}
        rowKey={(el) => el.date}
        size="small"
        bordered
        sticky
        scroll={{
          x: 600
        }}
        expandable={{
          rowExpandable: () => true,
          expandedRowRender: (record) => record.completed ?
            <ReportCosts data={record.costs || []} /> :
            <ReportCostsForm report={record} minDate={minDate} maxDate={maxDate} />
        }}
        summary={(pageData) => <ReportSummary reports={pageData} />}
      />
    </>
  );
};