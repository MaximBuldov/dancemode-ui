import { FileTextOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Divider, Drawer, Form, Input, Space, Table, TableProps } from 'antd';
import { ReportCosts, ReportCostsForm, ReportSummary } from 'components';
import dayjs from 'dayjs';
import { useGetReports } from 'hooks/useGetReports';
import { IReport, IReportCost } from 'models';
import { useState } from 'react';

const columnsCosts: TableProps<IReportCost>['columns'] = [
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Name'
  },
  {
    key: 'sum',
    dataIndex: 'sum',
    title: 'Sum',
    render: (el) => `$${el}`
  },
  {
    key: 'date',
    dataIndex: 'date',
    title: 'Date',
    render: (el) => dayjs(el).format('MM/DD/YYYY')
  }
];

const columns: TableProps<IReport>['columns'] = [
  {
    key: 'date',
    dataIndex: 'date',
    align: 'center',
    fixed: 'left',
    render: (el) => dayjs(el).format('MM/YY')
  },
  {
    title: 'Rev',
    key: 'revenue',
    dataIndex: 'revenue',
    align: 'center',
    render: (el) => <>${el}</>
  },
  {
    title: 'Costs',
    key: 'costs',
    dataIndex: 'costs',
    align: 'center',
    render: (el: IReportCost[]) => <b>${Math.round(el.reduce((acc, item) => acc + Number(item.sum), 0))}</b>
  },
  {
    title: 'Stud',
    key: 'students',
    dataIndex: 'students',
    align: 'center',
    render: (el) => <>{el}</>
  },
  {
    title: 'Prof',
    key: 'profit',
    dataIndex: 'profit',
    align: 'center',
    render: (el) => el !== 0 ? <>${el}</> : 'N/A'
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
    title: 'Coup',
    key: 'coupons',
    dataIndex: 'coupons',
    align: 'center',
    render: (el) => `$${el}`
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
  }
];

const minDate = dayjs().startOf('year').format('YYYY-MM');
const maxDate = dayjs().format('YYYY-MM');

export const Reports = () => {
  const [form] = Form.useForm();
  const [from, setFrom] = useState(minDate);
  const [to, setTo] = useState(maxDate);
  const [costsDrawer, openCostsDrawer] = useState(false);
  const { data, isPending } = useGetReports({ from, to });
  const costsTitle = `Costs ${from} - ${to}`;

  return (
    <>
      <Form
        form={form}
        initialValues={{
          from: minDate,
          to: dayjs().format('YYYY-MM')
        }}
        onFinish={({ from, to }) => {
          setFrom(from);
          setTo(to);
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
          x: 700
        }}
        expandable={{
          rowExpandable: () => true,
          expandedRowRender: (record) => record.completed ?
            <ReportCosts data={record.costs || []} /> :
            <ReportCostsForm report={record} minDate={minDate} maxDate={maxDate} />
        }}
        summary={(pageData) => <ReportSummary reports={pageData} />}
      />
      <Divider />
      <Button
        onClick={() => openCostsDrawer(true)}
        type="primary"
        icon={<FileTextOutlined />}
        block
        size="large"
      >
        {costsTitle}
      </Button>
      <Drawer
        title={costsTitle}
        onClose={() => openCostsDrawer(false)}
        open={costsDrawer}
        size="large"
      >
        <Table
          dataSource={data?.flatMap(el => el.costs || [])}
          columns={columnsCosts}
          pagination={false}
          loading={isPending}
          rowKey={el => el.name + el.sum + el.date}
          summary={(tableData) => {
            let totalCosts = tableData.reduce((acc, el) => acc += Number(el.sum), 0);

            return (
              <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
                <Table.Summary.Cell index={0}><b>Total:</b></Table.Summary.Cell>
                <Table.Summary.Cell colSpan={2} index={1}>${totalCosts.toFixed(2)}</Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      </Drawer>
    </>
  );
};