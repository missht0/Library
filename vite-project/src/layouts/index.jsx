import { Navigate, Outlet } from "react-router";
export default function Layout() {
  return (
    <div className="h-full">
      <Outlet />
    </div>
  );
}
