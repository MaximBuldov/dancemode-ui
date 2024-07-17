import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cartStore, userStore } from 'stores';

import { ContactsTwoTone, ProfileTwoTone } from '@ant-design/icons';
import { Menu as AntMenu, Button, Drawer, MenuProps } from 'antd';
import { useState } from 'react';
import { PRODUCT_CAT, PROFILE } from 'routes/consts';
import styles from './menu.module.scss';

type MenuItem = Required<MenuProps>['items'][number];

const userItems = [
  {
    label: 'classes',
    icon: '🗓️'
  },
  {
    label: 'coupons',
    icon: '🎟️'
  },
  {
    label: 'payments',
    icon: '💵'
  },
  {
    label: 'profile',
    icon: '💃'
  }
];

const adminItems = [
  {
    label: 'calendar',
    icon: '🗓️'
  },
  {
    label: 'students',
    icon: '👯‍♀️'
  },
  {
    label: 'orders',
    icon: '💵'
  },
  {
    label: 'reports',
    icon: '🗂️'
  },
  {
    label: 'all coupons',
    icon: '🎟️'
  }
];

const settingsMenu: MenuItem[] = [
  {
    key: PROFILE,
    label: 'Profile',
    icon: <ContactsTwoTone />
  },
  {
    key: PRODUCT_CAT,
    label: 'Class categories',
    icon: <ProfileTwoTone />
  }
];

const publicItems = [
  {
    label: 'login',
    icon: '🚪'
  },
  {
    label: 'sign up',
    icon: '💃'
  },
  {
    label: 'forgot password',
    icon: '🤔'
  }
];

export const Menu = () => {
  const items = userStore.isAuth
    ? userStore.isAdmin
      ? adminItems
      : userItems
    : publicItems;
  const [drawer, setDrawer] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <>
      <div className={styles.container}>
        <ul className={styles.list}>
          {items.map(({ label, icon }) => (
            <li key={label} className={styles.item}>
              <Link to={label.replace(' ', '-')}>
                <div className={styles.icon}>{icon}</div>
                <div className={styles.label}>{label}</div>
              </Link>
            </li>
          ))}
          {userStore.isAdmin && (
            <li
              key="settings"
              className={styles.item}
              onClick={() => setDrawer(true)}
            >
              <div className={styles.icon}>⚙️</div>
              <div className={styles.label}>Settings</div>
            </li>
          )}
        </ul>
      </div>
      {userStore.isAdmin && (
        <Drawer
          size="large"
          open={drawer}
          title="Settings"
          onClose={() => setDrawer(false)}
          footer={
            <Button
              danger
              type="primary"
              block
              onClick={() => {
                navigate('/');
                cartStore.clear();
                userStore.logout();
              }}
            >
              Log out
            </Button>
          }
        >
          <AntMenu
            items={settingsMenu}
            mode="inline"
            selectedKeys={[pathname]}
            onClick={({ key }) => {
              navigate(key);
              setDrawer(false);
            }}
          />
        </Drawer>
      )}
    </>
  );
};
