import { Button, Spin, Table, TableProps, Typography } from 'antd';
import { useCategory } from 'hooks';
import { ICategory } from 'models';
import { DeleteIcon } from './ui';

export const ClassCategory = () => {
  const { get, update, remove, create } = useCategory();

  const columns: TableProps<ICategory>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => renderEditRow(text, record, 'name')
    },
    {
      dataIndex: 'id',
      key: 'remove',
      align: 'center',
      render: (id, record) => (
        <DeleteIcon<ICategory> remove={remove} id={id} name={record.name} />
      )
    }
  ];

  return (
    <>
      <Button
        block
        onClick={() => {
          const name = window.prompt('Category name');
          if (name) create.mutate({ name });
        }}
        type="primary"
      >
        Create category
      </Button>
      <Table
        loading={get.isPending || create.isPending}
        rowKey={(el) => el.id}
        columns={columns}
        dataSource={get.data}
        size="small"
        pagination={false}
      />
    </>
  );

  function renderEditRow(text: string, el: ICategory, key: keyof ICategory) {
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
