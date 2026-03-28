import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { IKeys, ISetting } from 'models';
import { settingsService } from 'services';
import { DeleteIcon } from './ui';

export default function Settings() {
  const queryClient = useQueryClient();

  const { data: settings = [], isLoading } = useQuery({
    queryKey: [IKeys.SETTING],
    queryFn: () => settingsService.getAll()
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [IKeys.SETTING] });

  const createMutation = useMutation({
    mutationFn: settingsService.create,
    onSuccess: invalidate
  });

  const updateMutation = useMutation({
    mutationFn: (data: Pick<ISetting, 'id' | 'value'>) =>
      settingsService.update({ id: data.id, value: data.value }),
    onSuccess: invalidate
  });

  const removeMutation = useMutation({
    mutationFn: settingsService.remove,
    onSuccess: invalidate
  });

  const handleCreate = () => {
    const key = window.prompt('Enter setting key:');
    if (!key?.trim()) return;

    const value = window.prompt(`Enter value for "${key}":`);
    if (value === null) return;

    createMutation.mutate({ key: key.trim(), value });
  };

  const handleEdit = (record: ISetting) => {
    const value = window.prompt(
      `Update value for "${record.key}":`,
      record.value
    );
    if (value === null) return;

    updateMutation.mutate({ id: record.id, value });
  };

  const columns: ColumnsType<ISetting> = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key'
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value'
    },
    {
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <DeleteIcon<ISetting>
          remove={removeMutation}
          id={record.id}
          name={record.key}
        />
      )
    }
  ];

  return (
    <>
      <Button
        block
        type="primary"
        onClick={handleCreate}
        loading={createMutation.isPending}
      >
        Add Setting
      </Button>
      <Table
        rowKey={(el) => el.id}
        dataSource={settings}
        columns={columns}
        loading={isLoading}
        pagination={false}
        size="small"
        onRow={(record) => ({
          onClick: () => handleEdit(record)
        })}
      />
    </>
  );
}
