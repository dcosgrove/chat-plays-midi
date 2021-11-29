import {
  createContext, useState
 } from "react";

const TWITCH_APP_CLIENT_ID = 'xsdpos4tnftz6tirr730o0c3u5lfsj';

export const AuthContext = createContext({
  token: '',
  clientId: TWITCH_APP_CLIENT_ID,
  updateToken: () => {}
});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
      token: '',
      expiresAt: ''
    });

    return <AuthContext.Provider value={{ 
        token: auth.token,
        clientId: TWITCH_APP_CLIENT_ID,
        updateToken: (t, expiresAt) => {
          setAuth({
            token: t,
            expiresAt: expiresAt
          })
        }
      }}>
      {children}
    </AuthContext.Provider>
}

export default AuthProvider;
