import { useState, useEffect } from 'react';

function useAuth() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // TODO - manage twitch login state
  });

  return token;
}

export default useAuth;
