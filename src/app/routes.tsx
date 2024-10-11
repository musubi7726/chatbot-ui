import * as React from 'react';
import { Route, RouteComponentProps, Switch, useLocation } from 'react-router-dom';
import { RHOAI } from '@app/RHOAI/RHOAI';
import { NotFound } from '@app/NotFound/NotFound';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { OCP } from './OCP/OCP';
import { RHO } from './RHO/RHO';
import { Ansible } from './Ansible/Ansible';
import { RHEL } from './RHEL/RHEL';

let routeFocusTimer: number;
export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  /* eslint-disable @typescript-eslint/no-explicit-any */
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  exact?: boolean;
  path: string;
  title: string;
  routes?: undefined;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    component: Ansible,
    exact: true,
    label: 'Ansible',
    path: '/',
    title: 'PatternFly Seed | Ansible',
  },
  {
    component: OCP,
    exact: true,
    label: 'OpenShift Container Platform',
    path: '/ocp',
    title: 'PatternFly Seed | OpenShift Container Platform',
  },
  {
    component: RHEL,
    exact: true,
    label: 'Red Hat Enterprise Linux',
    path: '/rhel',
    title: 'PatternFly Seed | Red Hat Enterprise Linux',
  },
  {
    component: RHOAI,
    exact: true,
    label: 'Red Hat OpenShift AI',
    path: '/rhoai',
    title: 'PatternFly Seed | Red Hat OpenShift AI',
  },

  {
    component: RHO,
    exact: true,
    label: 'RHO 2025 FAQ',
    path: '/rho',
    title: 'PatternFly Seed | RHO 2025 FAQ',
  },
];

// a custom hook for sending focus to the primary content container
// after a view has loaded so that subsequent press of tab key
// sends focus directly to relevant content
// may not be necessary if https://github.com/ReactTraining/react-router/issues/5210 is resolved
const useA11yRouteChange = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    routeFocusTimer = window.setTimeout(() => {
      const mainContainer = document.getElementById('primary-app-container');
      if (mainContainer) {
        mainContainer.focus();
      }
    }, 50);
    return () => {
      window.clearTimeout(routeFocusTimer);
    };
  }, [pathname]);
};

const RouteWithTitleUpdates = ({ component: Component, title, ...rest }: IAppRoute) => {
  useA11yRouteChange();
  useDocumentTitle(title);

  function routeWithTitle(routeProps: RouteComponentProps) {
    return <Component {...rest} {...routeProps} />;
  }

  return <Route render={routeWithTitle} {...rest} />;
};

const PageNotFound = ({ title }: { title: string }) => {
  useDocumentTitle(title);
  return <Route component={NotFound} />;
};

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute[],
);

const AppRoutes = (): React.ReactElement => (
  <Switch>
    {flattenedRoutes.map(({ path, exact, component, title }, idx) => (
      <RouteWithTitleUpdates path={path} exact={exact} component={component} key={idx} title={title} />
    ))}
    <PageNotFound title="404 Page Not Found" />
  </Switch>
);

export { AppRoutes, routes };
