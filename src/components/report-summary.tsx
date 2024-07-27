import { Table } from 'antd';
import { IReport } from 'models';

interface IReportSummaryProps {
  reports: readonly IReport[];
}

const {
  Summary: { Row, Cell }
} = Table;

export const ReportSummary = ({ reports }: IReportSummaryProps) => {
  let totalCash = 0;
  let totalCard = 0;
  let totalRev = 0;
  let totalProf = 0;
  let totalBeg = 0;
  let totalAdv = 0;
  let totalStu = 0;
  let totalCosts = 0;

  reports.forEach(
    ({ card, cash, profit, revenue, adv, beg, students, coupons, costs }) => {
      totalCash += cash;
      totalCard += card;
      totalRev += revenue;
      totalProf += profit;
      totalBeg += beg;
      totalAdv += adv;
      totalStu += students;
      totalCosts +=
        costs?.reduce((acc, item) => acc + Number(item.sum), 0) || 0;
    }
  );

  const repCount = reports.length;

  return (
    <>
      <Row key={1} style={{ backgroundColor: '#fafafa' }}>
        <Cell index={0} />
        <Cell index={1}>
          <b>Total:</b>
        </Cell>
        <Cell align="center" index={2}>
          ${totalRev}
        </Cell>
        <Cell align="center" index={3}>
          ${Math.round(totalCosts)}
        </Cell>
        <Cell align="center" index={4}>
          {totalStu}
        </Cell>
        <Cell align="center" index={5}>
          ${Math.floor(totalProf)}
        </Cell>
        <Cell align="center" index={6}>
          ${totalCash}
        </Cell>
        <Cell align="center" index={7}>
          ${totalCard}
        </Cell>
        <Cell align="center" index={8}>
          {totalBeg}
        </Cell>
        <Cell align="center" index={9}>
          {totalAdv}
        </Cell>
      </Row>
      <Row key={2} style={{ backgroundColor: '#fafafa' }}>
        <Cell index={0} />
        <Cell index={1}>
          <b>Avg:</b>
        </Cell>
        <Cell align="center" index={2}>
          ${Math.round(totalRev / repCount)}
        </Cell>
        <Cell align="center" index={3}>
          ${Math.round(totalCosts / repCount)}
        </Cell>
        <Cell align="center" index={4}>
          {Math.round(totalStu / repCount)}
        </Cell>
        <Cell align="center" index={5}>
          ${Math.round(totalProf / repCount)}
        </Cell>
        <Cell align="center" index={6}>
          ${Math.round(totalCash / repCount)}
        </Cell>
        <Cell align="center" index={7}>
          ${Math.round(totalCard / repCount)}
        </Cell>
        <Cell align="center" index={8}>
          {Math.round(totalBeg / repCount)}
        </Cell>
        <Cell align="center" index={9}>
          {Math.round(totalAdv / repCount)}
        </Cell>
      </Row>
    </>
  );
};
