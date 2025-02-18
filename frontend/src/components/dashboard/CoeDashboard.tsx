import React from "react";
import DashboardTemplate from "./DashboardTemplate";

const CoeDashboard = ({ user }: any) => (
  <DashboardTemplate
    title="Examination Controller Dashboard"
    user={user}
    menuItems={[]}
  >
    <div>
      <h2>Welcome, {user.name}</h2>
      <p>Here you can manage all examination related activities.</p>
      {/* Add more COE specific content here */}
    </div>
  </DashboardTemplate>
);

export default CoeDashboard;
