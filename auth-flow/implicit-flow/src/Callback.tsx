import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

export function Callback() {
  const { hash } = useLocation();
  const { login, auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      navigate("/login");
      return;
    }

    const searchParams = new URLSearchParams(hash.replace("#", ""));
    const accessToken = searchParams.get("access_token");
    const idToken = searchParams.get("id_token");
    const state = searchParams.get("state");

    if (!accessToken || !idToken || !state) {
      navigate("/login");
      return;
    } else {
      login(accessToken, idToken, state);
    }
  }, [login, hash, auth, navigate]);

  return <div>Loading...</div>;
}
