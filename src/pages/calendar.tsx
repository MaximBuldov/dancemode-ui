import { Button, message } from 'antd';
import { AddClassModal } from 'components';
import { useState } from 'react';

export const Calendar = () => {
  const [modal, setModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onSuccess = () => {
    setModal(false);
    messageApi.success('Success!');
  };

  return (
    <>
      <Button block type="primary" onClick={() => setModal(true)}>Add class</Button>
      <AddClassModal isOpen={modal} closeModal={() => onSuccess()} />
      {contextHolder}
    </>
  );
};