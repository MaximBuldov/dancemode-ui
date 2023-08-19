import { Avatar, Badge, Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Menu } from 'components';
import { observer } from 'mobx-react-lite';
import { cartStore, userStore } from 'stores';

import styles from './template.module.scss';

const { Header, Content } = Layout;

export const Template = observer(() => {
  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.logo}>DanceMode</div>
        {userStore.data && (
          <Badge count={cartStore.couponCount}>
            <Avatar style={{ backgroundColor: '#1677ff' }}>{userStore.initials}</Avatar>
          </Badge>
        )}
      </Header>
      <Layout className={styles.layout}>
        <Content>
          <Outlet />
        </Content>
      </Layout>
      <Menu />
    </Layout>
  );
});