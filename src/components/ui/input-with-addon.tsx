import { Form, Input, Space } from 'antd';
import { Rule } from 'antd/es/form';
import { ReactNode } from 'react';

interface AddonInputProps {
  addon?: ReactNode;
  prefix?: ReactNode;
  password?: boolean;
  name: string;
  rules?: Rule[];
  hasFeedback?: boolean;
  dependencies?: any[];
}

export const AddonInput = ({
  addon,
  prefix,
  password,
  name,
  rules,
  hasFeedback,
  dependencies
}: AddonInputProps) => {
  return (
    <Space.Compact block>
      <Space.Addon>
        <span style={{ whiteSpace: 'nowrap' }}>{addon}</span>
      </Space.Addon>
      <Form.Item
        name={name}
        rules={rules}
        hasFeedback={hasFeedback}
        dependencies={dependencies}
        style={{
          marginBottom: 0,
          width: '100%'
        }}
      >
        {password ? (
          <Input.Password prefix={prefix} />
        ) : (
          <Input prefix={prefix} />
        )}
      </Form.Item>
    </Space.Compact>
  );
};
