import { Avatar, Badge, Layout, Spin } from 'antd';
import { Outlet } from 'react-router-dom';
import { Menu } from 'components';
import { observer } from 'mobx-react-lite';
import { makeupStore, userStore } from 'stores';
import { useConfigCall } from 'hooks';

import styles from './template.module.scss';

const { Header, Content } = Layout;

export const Template = observer(() => {
  const { loading, contextHolder } = useConfigCall();
  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.logo}>DanceMode</div>
        {userStore.data && (
          <Badge count={makeupStore.count}>
            <Avatar style={{ backgroundColor: '#1677ff' }}>{userStore.initials}</Avatar>
          </Badge>
        )}
      </Header>
      <Layout className={styles.layout}>
        <Spin spinning={loading}>
          <Content>
            <Outlet />
            {contextHolder}
          </Content>
        </Spin>
      </Layout>
      <Menu />
    </Layout>
  );
});