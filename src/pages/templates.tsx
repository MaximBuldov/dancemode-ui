import { Button, Divider, Spin, Table, TableProps, Typography } from 'antd';
import { DeleteIcon } from 'components';
import { useTemplate } from 'hooks';
import { ITemplate } from 'models/template.model';

export const Templates = () => {
  const { get, update, remove, create } = useTemplate();

  const columns: TableProps<ITemplate>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => renderEditRow(text, record, 'name')
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => renderEditRow(text, record, 'price')
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (text, record) => renderEditRow(text, record, 'time')
    },
    {
      dataIndex: 'id',
      key: 'remove',
      align: 'center',
      render: (id, record) => (
        <DeleteIcon<ITemplate> remove={remove} id={id} name={record.name} />
      )
    }
  ];

  return (
    <>
      <Button
        block
        onClick={() => {
          const name = window.prompt('Template name');
          const price = window.prompt('Template price');
          const time = window.prompt('Template time');
          if (name && price && time)
            create.mutate({ name, price: +price, time });
        }}
        type="primary"
      >
        Create template
      </Button>
      <Divider />
      <Table
        loading={get.isPending || create.isPending}
        rowKey={(el) => el.id}
        columns={columns}
        dataSource={get.data}
        size="small"
      />
    </>
  );

  function renderEditRow(text: string, el: ITemplate, key: keyof ITemplate) {
    return (
      <Typography.Paragraph
        editable={{
          text,
          onChange: (value) => {
            if (value !== text) update.mutate({ id: el.id, [key]: value });
          },
          enterIcon: null,
          triggerType: ['icon', 'text']
        }}
        style={{ margin: 0 }}
      >
        {update.isPending && update.variables.id === el.id ? (
          <Spin spinning />
        ) : (
          text
        )}
      </Typography.Paragraph>
    );
  }
};
