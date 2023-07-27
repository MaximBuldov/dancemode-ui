import React from 'react';
import { Link } from 'react-router-dom';
import { userStore } from 'stores';

import styles from './menu.module.scss';

const userItems = [
  {
    label: 'classes',
    icon: '🗓️'
  },
  {
    label: 'makeups',
    icon: '👯‍♀️'
  },
  {
    label: 'payments',
    icon: '💵'
  },
  {
    label: 'video',
    icon: '📹'
  },
  {
    label: 'profile',
    icon: '💃'
  }
];

const adminItems = [
  {
    label: 'classes',
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
  const items = userStore.isAuth ?
    userStore.isAdmin ? adminItems : userItems :
    publicItems;
  return (
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
  );
};