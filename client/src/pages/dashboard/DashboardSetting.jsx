import AccountDelete from "../../components/dialog/AccountDelete";

const DashboardSetting = () => {
  return (
    <div className="dashboardProfileContainer">
      <h4>Settings</h4>
      <div className="deleteSetting">
        <p>Delete you account and data</p>
        <AccountDelete />
      </div>
    </div>
  );
};

export default DashboardSetting;
