import { App as AntApp, ConfigProvider } from 'antd';
import ReactDOM from 'react-dom/client';

import App from './App';
import { theme } from './theme';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ConfigProvider theme={theme}>
    <AntApp>
      <App />
    </AntApp>
  </ConfigProvider>
);
