import { Avatar, Layout } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { Menu } from 'components';
import { observer } from 'mobx-react-lite';
import { userStore } from 'stores';
import * as routes from 'routes/consts';

import styles from './template.module.scss';

const { Header, Content } = Layout;

export const Template = observer(() => {
  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.logo}><Link to="/">DanceMode</Link></div>
        {userStore.data && (
          <Link to={routes.PROFILE}>
            <Avatar style={{ backgroundColor: '#1677ff' }}>
              {userStore.initials}
            </Avatar>
          </Link>
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