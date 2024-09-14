import { Outlet } from "react-router-dom";
import Menu from "../../components/menu/Menu";
import "./dashboard.css";

const DashboardLayout = () => {
  return (
    <div className="mainDashboardContainer">
      <section className="menu">
        <Menu />
      </section>
      <section className="menuContainer">
        <Outlet />
      </section>
    </div>
  );
};

export default DashboardLayout;
