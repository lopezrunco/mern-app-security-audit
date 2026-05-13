import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { AuthContext } from "../../App";

// Acces to the children inside this component
function RequireAuth({ children, allowedRoles }) {
  const { state: auth } = React.useContext(AuthContext);
  const location = useLocation();
  // Search allowed roles and check if the actual user matches
  const roleMatches = !allowedRoles
    ? true
    : allowedRoles.find((role) => role === auth.role);

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  } else if (!roleMatches) {
    return <Navigate to="/forbidden" />;
  } else {
    return children;
  }
}

export default RequireAuth;
