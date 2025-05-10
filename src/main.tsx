import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Layout from '@/Layout';
import 'dayjs/locale/zh-cn';
import 'virtual:uno.css';
import './index.less';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Layout />
  </StrictMode>,
)
