import { Link } from 'react-router-dom';
import { userStore } from 'stores';

import { MenuProps } from 'antd';
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
    label: 'all coupons',
    icon: '🎟️'
  },
  {
    label: 'bundels',
    icon: '🗂️'
  },
  {
    label: 'templates',
    icon: '📋'
  },
  {
    label: 'profile',
    icon: '💃'
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
        </ul>
      </div>
    </>
  );
};
