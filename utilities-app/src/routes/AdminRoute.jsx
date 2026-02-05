import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { session, userRole } = UserAuth();

  // Not logged in
  if (!session) {
    return <Navigate to="/signin" />;
  }

  // Logged in but not admin
  if (userRole !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  // Admin allowed
  return children;
};

export default AdminRoute;