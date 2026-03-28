import { Divider } from 'antd';
import { ClassTemplates } from 'components';
import { ClassCategory } from 'components/class-category';
import Settings from 'components/settings';

export const SettingsPage = () => {
  return (
    <>
      <ClassTemplates />
      <Divider size="large" />
      <ClassCategory />
      <Divider size="large" />
      <Settings />
    </>
  );
};
