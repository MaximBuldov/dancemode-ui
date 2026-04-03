import { Form, Input, InputNumber, Select, Space } from 'antd';
import { Rule } from 'antd/es/form';
import dayjs, { Dayjs } from 'dayjs';
import React, { useMemo, useState } from 'react';

const PLACEHOLDER_YEAR = 1900;

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];

interface BirthdayPickerProps {
  name: string;
  rules?: Rule[];
}

export const BirthdayPicker: React.FC<BirthdayPickerProps> = ({
  rules,
  name
}) => {
  const form = Form.useFormInstance();

  const initialValue: string | undefined = form.getFieldValue(name);
  const initialDob = initialValue ? dayjs(initialValue) : null;

  const [day, setDay] = useState<number | undefined>(
    initialDob?.isValid() ? initialDob.date() : undefined
  );
  const [month, setMonth] = useState<number | undefined>(
    initialDob?.isValid() ? initialDob.month() + 1 : undefined
  );
  const [yearText, setYearText] = useState<string>(() => {
    if (!initialDob?.isValid()) return '';
    const y = initialDob.year();
    return y === PLACEHOLDER_YEAR ? '' : String(y);
  });

  const parsedYear: Dayjs | null = useMemo(() => {
    const num = parseInt(yearText, 10);
    const isValid =
      yearText.length === 4 && num >= 1900 && num <= dayjs().year();
    return isValid ? dayjs().year(num) : null;
  }, [yearText]);

  const daysInMonth = useMemo(() => {
    const refYear = parsedYear ? parsedYear.year() : dayjs().year();
    const refMonth = month ?? 1;
    const count = dayjs(
      `${refYear}-${String(refMonth).padStart(2, '0')}-01`
    ).daysInMonth();
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [month, parsedYear]);

  const commitToForm = (
    nextDay: number | undefined,
    nextMonth: number | undefined,
    nextYear: Dayjs | null
  ) => {
    if (!nextDay || !nextMonth) {
      form.setFieldValue(name, null);
      return;
    }

    const y = nextYear ? nextYear.year() : PLACEHOLDER_YEAR;
    const m = String(nextMonth).padStart(2, '0');
    const daysCount = dayjs(`${y}-${m}-01`).daysInMonth();
    const clampedDay = Math.min(nextDay, daysCount);
    const d = String(clampedDay).padStart(2, '0');

    form.setFieldValue(name, dayjs(`${y}-${m}-${d}`).toISOString());
    if (clampedDay !== nextDay) setDay(clampedDay);
  };

  const handleDayChange = (nextDay: number | undefined) => {
    setDay(nextDay);
    commitToForm(nextDay, month, parsedYear);
  };

  const handleMonthChange = (nextMonth: number | undefined) => {
    setMonth(nextMonth);
    commitToForm(day, nextMonth, parsedYear);
  };

  const handleYearTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setYearText(raw);

    const num = parseInt(raw, 10);
    const isValid = raw.length === 4 && num >= 1900 && num <= dayjs().year();
    const nextYear = isValid ? dayjs().year(num) : null;

    commitToForm(day, month, nextYear);
  };
  return (
    <Space.Compact block>
      <Space.Addon>
        <span style={{ whiteSpace: 'nowrap' }}>DOB</span>
      </Space.Addon>
      <Select
        placeholder="Day"
        value={day}
        onChange={handleDayChange}
        style={{ width: 80 }}
        options={daysInMonth.map((d) => ({ value: d, label: d }))}
      />
      <Select
        placeholder="Month"
        value={month}
        onChange={handleMonthChange}
        style={{ width: 130 }}
        options={MONTHS}
      />
      <Input
        placeholder="Year (optional)"
        value={yearText}
        onChange={handleYearTextChange}
        maxLength={4}
        style={{ width: 130 }}
      />
      <Form.Item rules={rules} name={name} hidden>
        <InputNumber maxLength={4} minLength={4} />
      </Form.Item>
    </Space.Compact>
  );
};
