import { RouterProvider } from 'react-router-dom';
import routers from '@/routers';
import useTheme from '@/hooks/useTheme';
const Layout = () => {

  useTheme();

  return <RouterProvider router={routers} />
}

export default Layout;