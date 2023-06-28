import { Navigate, useRoutes } from "react-router-dom";
import routes from "./index";
import { Suspense } from "react";
import { getCookie } from "../utils";
// import LoadingScreen from "src/components/loading-screen/LoadingScreen";

function RouterBeforeEach(props) {
  document.title = ` ${props.route.meta.title} | HZNU图书馆`;
  const isLogin = !!getCookie("userInfo"); // !!转换为布尔值
  if (props?.route?.meta?.isLogin) {
    if (!isLogin) {
      return <Navigate to={"/login"} replace />;
    }
  }
  return <>{props.children}</>;
}

// 渲染路由
const renderRoutes = (Routes) =>
  Routes.map((item) => {
    const route = {
      meta: item.meta,
      path: `${item.path}`,
    };
    if (item.component) {
      route.element = (
        <Suspense fallback={<div>Loading...</div>}>
          <RouterBeforeEach route={item}>
            <item.component />
          </RouterBeforeEach>
        </Suspense>
      );
      // route.element = <item.component/>
    }
    if (item.children) {
      route.children = renderRoutes(item.children);
    }
    if (item.redirect) {
      route.element = <Navigate to={item.redirect} />;
    }
    return route;
  });

const Router = () => {
  return useRoutes(renderRoutes(routes));
};

export default Router;
