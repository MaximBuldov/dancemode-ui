import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Space,
  Switch,
  message
} from 'antd';
import dayjs from 'dayjs';
import { IKeys, IPaymentMethod, IReport } from 'models';
import { reportService } from 'services';

interface ReportCostsFormPrps {
  report: IReport;
  minDate: string;
  maxDate: string;
}

const { useForm, Item, List } = Form;

export const ReportCostsForm = ({
  report,
  minDate,
  maxDate
}: ReportCostsFormPrps) => {
  const { date, costs, id, stripe } = report;
  const [messageApi, contextHolder] = message.useMessage();
  const client = useQueryClient();
  const notCurrentMonth = date !== maxDate;
  const [form] = useForm();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: IReport) =>
      id ? reportService.update({ id, data }) : reportService.create(data),
    onSuccess: (data) => {
      client.setQueryData(
        [IKeys.REPORTS, { from: minDate, to: maxDate }],
        (reports: IReport[] | undefined) =>
          id
            ? reports?.map((el) => (el.id === data.id ? data : el))
            : [data, ...(reports || [])]
      );
      messageApi.success('Report updated');
    }
  });
  return (
    <>
      <Form<IReport>
        form={form}
        initialValues={{
          costs: [
            { name: IPaymentMethod.STRIPE, sum: stripe?.toFixed(2) },
            ...(costs?.filter(
              (el) => el.name.toLocaleLowerCase() !== IPaymentMethod.STRIPE
            ) || [])
          ],
          date
        }}
        size="small"
        layout="inline"
        onFinish={(values) =>
          mutate({
            ...report,
            ...values,
            profit:
              report.revenue -
              Number(values.costs?.reduce((acc, el) => acc + Number(el.sum), 0))
          })
        }
      >
        <Item name="date" rules={[{ required: true }]} hidden>
          <Input />
        </Item>
        <Space direction="vertical" style={{ width: '100%' }}>
          <List name="costs">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Flex gap="small" key={key}>
                    <Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[{ required: true }]}
                      style={{ width: '150px' }}
                    >
                      <Input placeholder="Name" />
                    </Item>
                    <Item
                      {...restField}
                      name={[name, 'sum']}
                      rules={[{ required: true }]}
                    >
                      <InputNumber
                        controls={false}
                        min={0}
                        placeholder="Sum"
                        prefix="$"
                        style={{ width: '100px' }}
                      />
                    </Item>
                    <Item
                      {...restField}
                      name={[name, 'date']}
                      initialValue={dayjs().format('YYYY-MM-DD')}
                      hidden
                    >
                      <Input />
                    </Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Flex>
                ))}
                <Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add costs
                  </Button>
                </Item>
              </>
            )}
          </List>
          {notCurrentMonth && (
            <Item name="completed">
              <Switch
                checkedChildren="Complete"
                unCheckedChildren="Report uncompleted"
                size="default"
              />
            </Item>
          )}
          <Button loading={isPending} htmlType="submit" type="primary" block>
            Submit
          </Button>
        </Space>
      </Form>
      {contextHolder}
    </>
  );
};
