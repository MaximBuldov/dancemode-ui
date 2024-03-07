import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { IReportCost } from 'models';

interface ReportCostsProps {
  data: IReportCost[]
}

const { Summary: { Row, Cell } } = Table;

const columns: ColumnsType<IReportCost> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Sum',
    dataIndex: 'sum',
    key: 'sum',
    align: 'center',
    render: (el) => <>${el}</>
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    align: 'center',
    render: (el) => dayjs(el).format('MM/DD/YYYY')
  }
];

export const ReportCosts = ({ data }: ReportCostsProps) => {
  return (
    <Table
      dataSource={data}
      columns={columns}
      pagination={false}
      size="small"
      rowKey={(el) => el.name + el.sum + el.date}
      summary={(tableData) => {
        let total = 0;
        tableData.forEach(el => {
          total += +el.sum;
        });

        return (
          <Row style={{ backgroundColor: '#fafafa' }}>
            <Cell index={0}><b>Total:</b></Cell>
            <Cell align="center" index={1}>${total}</Cell>
          </Row>
        );
      }}
    />
  );
};