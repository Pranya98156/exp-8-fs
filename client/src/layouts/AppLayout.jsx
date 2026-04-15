import { Outlet } from "react-router-dom";
import RoleBasedNav from "../components/RoleBasedNav";

export const AppLayout = () => {
  return (
    <div className="app-shell">
      <RoleBasedNav />
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
};
