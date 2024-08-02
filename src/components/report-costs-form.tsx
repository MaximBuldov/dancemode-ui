import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Flex, Form, Input, InputNumber, Space, message } from 'antd';
import dayjs from 'dayjs';
import { IReport, IReportCost } from 'models';
import { reportService } from 'services';

interface ReportCostsFormPrps {
  report: IReport;
}

interface CostsForm {
  costs: IReportCost[];
}

const { useForm, Item, List } = Form;

export const ReportCostsForm = ({ report }: ReportCostsFormPrps) => {
  const { costs, stripe } = report;
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = useForm();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: IReportCost[]) => reportService.update(data),
    onSuccess: () => {
      messageApi.success('Report updated');
    }
  });

  return (
    <>
      <Form<CostsForm>
        form={form}
        initialValues={{
          costs: costs?.map((el) => ({
            ...el,
            date: dayjs(el.date).format('YYYY-MM-DD')
          }))
        }}
        size="small"
        layout="inline"
        onFinish={({ costs }) =>
          mutate(
            costs.map(({ date, sum, ...rest }) => ({
              ...rest,
              date: dayjs(date).toDate(),
              sum: +sum
            }))
          )
        }
      >
        <Flex gap="small">
          <div>
            <b>Stripe:</b>
          </div>
          <div>${stripe}</div>
        </Flex>
        <Space direction="vertical" style={{ width: '100%' }}>
          <List name="costs">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Flex key={key}>
                    <Item<IReportCost[]>
                      {...restField}
                      name={[name, 'id']}
                      hidden
                    >
                      <Input />
                    </Item>
                    <Item<IReportCost[]>
                      {...restField}
                      name={[name, 'name']}
                      rules={[{ required: true }]}
                      style={{ width: '100px' }}
                    >
                      <Input placeholder="Name" />
                    </Item>
                    <Item
                      {...restField}
                      name={[name, 'date']}
                      initialValue={dayjs(report.date).format('YYYY-MM-DD')}
                      style={{ width: '80px' }}
                    >
                      <Input
                        type="date"
                        min={dayjs(report.date)
                          .startOf('month')
                          .format('YYYY-MM-DD')}
                        max={dayjs(report.date)
                          .endOf('month')
                          .format('YYYY-MM-DD')}
                      />
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
                        style={{ width: '60px' }}
                      />
                    </Item>
                    <Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Item>
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
          <Button loading={isPending} htmlType="submit" type="primary" block>
            Update
          </Button>
        </Space>
      </Form>
      {contextHolder}
    </>
  );
};
