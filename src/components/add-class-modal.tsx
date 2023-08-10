import { Divider, Modal, Radio } from 'antd';
import { CreateProductsForm, CreateSingleProductForm } from 'components';
import { useState } from 'react';

interface AddClassModalProps {
  isOpen: boolean;
  closeModal: () => void
}
const options = ['Single', 'Multiple'];

export const AddClassModal = ({ isOpen, closeModal }: AddClassModalProps) => {
  const [form, setForm] = useState('');

  return (
    <Modal
      title={<span style={{ fontSize: 20 }}>Add class</span>}
      open={isOpen}
      footer={null}
      onCancel={() => closeModal()}
    >
      <Radio.Group
        options={options}
        onChange={(e) => setForm(e.target.value)}
        value={form}
        optionType="button"
        buttonStyle="solid"
        style={{ width: '100%' }}
      />
      <Divider />
      {form === 'Single' && <CreateSingleProductForm closeModal={closeModal} />}
      {form === 'Multiple' && <CreateProductsForm closeModal={closeModal} />}
    </Modal>
  );
};