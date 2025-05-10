import React, { lazy, Suspense } from 'react';
import {createBrowserRouter, RouteObject } from 'react-router-dom';
import { Loading } from '@/components/vscing-design';
import NotFound from '@/pages/exception/404';

const lazyLoad = (component: string, props: any = {}): React.ReactNode => {
  // 异步页面搭配 layz
  const pageModules = import.meta.glob(['@/pages/**/*.tsx']);
  let ChildrenComp: any = null;
  try {
    ChildrenComp = lazy(pageModules[`/src/${component}.tsx`] as any);
  } catch(err: any) {
    return <NotFound />;
  }


  // TODO https://cn.vitejs.dev/guide/features.html#dynamic-import
  // const ChildrenComp = lazy(async() => await import(`../../../src/${pathNode}/${component}`));

  // fallback 动画 Nprogress 和 Spin
  return <Suspense
    fallback={<Loading />}
  >
    <ChildrenComp {...props} />
  </Suspense>;
};

const basename = import.meta.env.VITE_BASE_NAME || '/';

const routes: RouteObject[] = [
  {
    path: '/',
    element: lazyLoad('pages/home/index', {
      title: 'Home'
    }),
  },
  {
    path: '*',
    element: lazyLoad('page/exception/404', {
      title: 'NOT FOUND'
    })
  },
];

const router: any = createBrowserRouter(routes, {
  basename: basename
});

export default router;