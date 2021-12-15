import { useEffect, useContext } from 'react';
import { AuthContext } from './context/Auth';
import { Navigate } from 'react-router-dom';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function AuthRedirect() {
  const {
    updateToken
  } = useContext(AuthContext);

  const token = document.location.hash.split('&')[0].replace('#access_token=', '');

  useEffect(() => {
    // TODO - figure out expiration time
    const expiresAt = Date.now();
    updateToken(token, expiresAt);
  });

  return <div>
      { token !== '' ? <Navigate replace to="/" /> : `Authorizing...` }
  </div>;
}

export default AuthRedirect;
