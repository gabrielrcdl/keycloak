import { useContext, type PropsWithChildren } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate } from "react-router-dom";

export function PrivateRouter(props: PropsWithChildren) {
  const authContext = useContext(AuthContext);

  if (!authContext.auth) {
    return <Navigate to="/login" />;
  }
  return props.children;
}
