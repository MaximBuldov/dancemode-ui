import { ShoppingCartOutlined } from '@ant-design/icons';
import { Avatar, FloatButton, Layout } from 'antd';
import { Menu } from 'components';
import { observer } from 'mobx-react-lite';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import * as routes from 'routes/consts';
import { cartStore, userStore } from 'stores';

import { useState } from 'react';
import styles from './template.module.scss';

const { Header, Content } = Layout;

export const Template = observer(() => {
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);
  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.logo}>
          <Link to="/">DanceMode</Link>
        </div>
        <div>
          {userStore.data && (
            <Link to={routes.PROFILE}>
              <Avatar style={{ backgroundColor: '#1677ff' }}>
                {userStore.initials}
              </Avatar>
            </Link>
          )}
        </div>
      </Header>
      <Layout className={styles.layout}>
        <Content>
          <Outlet />
        </Content>
      </Layout>
      {!!cartStore.count && (
        <FloatButton
          icon={<ShoppingCartOutlined />}
          type="primary"
          style={{ bottom: 80 }}
          badge={{ count: cartStore.count }}
          onClick={() => navigate('/cart')}
        />
      )}
      <Menu />
    </Layout>
  );
});
