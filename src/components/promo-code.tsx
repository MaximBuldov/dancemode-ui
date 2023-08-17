import { CaretRightOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Space, Typography } from 'antd';
import { useState } from 'react';

export const PromoCode = () => {
  const [open, setOpen] = useState(false);
  return (
    <Space
      direction="vertical"
      style={{
        width: '100%',
        marginBottom: 16,
        borderBottom: '1px solid rgba(5, 5, 5, 0.06)',
        paddingBottom: 16
      }}>
      <Row
        onClick={() => setOpen(prev => !prev)}
        justify="space-between"
      >
        <Col><Typography.Text strong>Promo Code</Typography.Text></Col>
        <Col><CaretRightOutlined rotate={open ? 90 : 0} /></Col>
      </Row>
      {open && (
        <Form>
          <Row justify="space-between" wrap={false} gutter={[16, 0]}>
            <Col style={{ width: '100%' }}>
              <Form.Item style={{ marginBottom: 0 }}><Input placeholder="Promo Code" /></Form.Item>
            </Col>
            <Col>
              <Form.Item style={{ marginBottom: 0 }}><Button type="primary" ghost htmlType="submit">Apply</Button></Form.Item>
            </Col>
          </Row>
        </Form >
      )}
    </Space>
  );
};