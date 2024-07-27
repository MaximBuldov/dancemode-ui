import { Button, Divider, Spin, Table, TableProps, Typography } from 'antd';
import { DeleteIcon } from 'components';
import { useCategory } from 'hooks';
import { ICategory } from 'models';
import { useState } from 'react';

export const ProductCategories = () => {
  const [page, setPage] = useState(1);
  const { get, update, remove, create } = useCategory(page);

  const columns: TableProps<ICategory>['columns'] = [
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
      render: renderNameRow
    },
    {
      dataIndex: 'id',
      key: 'remove',
      align: 'center',
      render: (id) => <DeleteIcon<ICategory> remove={remove} id={id} />
    }
  ];

  return (
    <>
      <Button
        block
        onClick={() => {
          const name = window.prompt('Category name');
          if (name) create.mutate(name);
        }}
        type="primary"
      >
        Create category
      </Button>
      <Divider />
      <Table
        loading={get.isPending || create.isPending}
        rowKey={(el) => el.id}
        columns={columns}
        dataSource={get.data?.data}
        size="small"
        pagination={{
          pageSize: 10,
          current: page,
          total: get.data?.headers['total'],
          onChange: (number) => setPage(number)
        }}
      />
    </>
  );

  function renderNameRow(text: string, el: ICategory) {
    return (
      <Typography.Paragraph
        editable={{
          text,
          onChange: (value) => {
            if (value !== text) update.mutate({ id: el.id, name: value });
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
