import React from "react";
import DashboardTemplate from "./DashboardTemplate";

const HodDashboard = ({ user }: any) => (
  <DashboardTemplate
    title="Department Head Dashboard"
    user={user}
    menuItems={[]}
  >
    {/* Add HOD specific content here */}
  </DashboardTemplate>
);

export default HodDashboard;
