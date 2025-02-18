export interface DashboardProps {
  user: {
    user_id: string;
    username: string;
    email: string;
    designation: {
      id: number;
      name: string;
      code: string;
      permissions: Record<string, any>;
    };
  };
}
