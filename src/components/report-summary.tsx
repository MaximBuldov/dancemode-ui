import { Table } from 'antd';
import { IReport } from 'models';

interface IReportSummaryProps {
  reports: readonly IReport[]
}

const { Summary: { Row, Cell } } = Table;

export const ReportSummary = ({ reports }: IReportSummaryProps) => {
  let totalCash = 0;
  let totalCard = 0;
  let totalRev = 0;
  let totalProf = 0;
  let totalBeg = 0;
  let totalAdv = 0;
  let totalStu = 0;
  let totalCoup = 0;

  reports.forEach(({ card, cash, profit, revenue, adv, beg, students, coupons }) => {
    totalCash += cash;
    totalCard += card;
    totalRev += revenue;
    totalProf += profit;
    totalBeg += beg;
    totalAdv += adv;
    totalStu += students;
    totalCoup += coupons;
  });

  return (
    <Row style={{ backgroundColor: '#fafafa' }}>
      <Cell index={0} />
      <Cell index={1}><b>Total:</b></Cell>
      <Cell align="center" index={2}>${totalCash}</Cell>
      <Cell align="center" index={3}>${totalCard}</Cell>
      <Cell align="center" index={4}>${totalCoup}</Cell>
      <Cell align="center" index={5}><b>${totalRev}</b></Cell>
      <Cell align="center" index={6}><b>${totalProf}</b></Cell>
      <Cell align="center" index={7}>{totalBeg}</Cell>
      <Cell align="center" index={8}>{totalAdv}</Cell>
      <Cell align="center" index={9}><b>{totalStu}</b></Cell>
    </Row>
  );
};