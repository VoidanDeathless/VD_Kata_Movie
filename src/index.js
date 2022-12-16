import { ConfigProvider } from 'antd';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './components/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider direction="ltr">
    <App />
  </ConfigProvider>
);
