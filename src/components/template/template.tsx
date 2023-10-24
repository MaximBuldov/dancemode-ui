import { Avatar, Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Menu } from 'components';
import { observer } from 'mobx-react-lite';
import { userStore } from 'stores';

import styles from './template.module.scss';

const { Header, Content } = Layout;

export const Template = observer(() => {
  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.logo}>DanceMode</div>
        {userStore.data && (
          <Avatar style={{ backgroundColor: '#1677ff' }}>{userStore.initials}</Avatar>
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