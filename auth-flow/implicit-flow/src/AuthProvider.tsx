import { createContext, useCallback, useState } from "react";
import * as utils from "./util";
import type { JWTPayload } from "jose";
import type { PropsWithChildren } from "react";

type AuthContextProps = {
  auth: JWTPayload | null;
  makeLoginUrl: () => string;
  makeLogoutUrl: () => string;
  login: (accessToken: string, idToken: string, state: string) => JWTPayload;
};

const initContextData: AuthContextProps = {
  auth: null,
  makeLoginUrl: utils.makeLoginUrl,
  //@ts-expect-error - this is a mock function

  makeLogoutUrl: () => {},
  //@ts-expect-error - this is a mock function

  login: () => {},
};

//create a context for the login state
export const AuthContext = createContext(initContextData);

//create a provider for the login state
export const AuthProvider = (props: PropsWithChildren) => {
  const makeLogin = useCallback((accessToken: string, idToken: string, state: string) => {
    const authData = utils.login(accessToken, idToken, state);
    setData((oldData) => ({
      auth: authData,
      makeLoginUrl: oldData.makeLoginUrl,
      makeLogoutUrl: oldData.makeLogoutUrl,
      login: oldData.login,
    }));
    return authData;
  }, []);

  const [data, setData] = useState({
    auth: utils.getAuth(),
    makeLoginUrl: utils.makeLoginUrl,
    makeLogoutUrl: utils.makeLogoutUrl,
    login: makeLogin,
  });

  return <AuthContext.Provider value={data as AuthContextProps}>{props.children}</AuthContext.Provider>;
};
