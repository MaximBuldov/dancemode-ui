import { Divider } from 'antd';
import { ClassTemplates } from 'components';
import { ClassCategory } from 'components/class-category';

export const Settings = () => {
  return (
    <>
      <ClassTemplates />
      <Divider size="large" />
      <ClassCategory />
    </>
  );
};
