import {
  useContext,
  useState,
  useEffect
} from 'react';

import { ApiClient } from 'twitch';
import { StaticAuthProvider } from 'twitch-auth';
import { PubSubClient } from 'twitch-pubsub-client';
import { AuthContext } from '../context/Auth';

function useTwitchPubSubClient() {
  const [listener, setListener] = useState(null);

  const {
    clientId,
    token
  } = useContext(AuthContext);

  useEffect(() => {
    const authProvider = new StaticAuthProvider(clientId, token);
    const apiClient = new ApiClient({ authProvider });
    const pubSubClient = new PubSubClient();

    // (async () => {
    //   const userId = await pubSubClient.registerUserListener(apiClient);

    //   console.log('connecting listener...');
    //   const listener = await pubSubClient.onModAction(userId, '7864803', (msg) => {
    //     console.log(msg);
    //   });

    //   console.log('connected!');
    //   setListener(listener);
    // })()

    return () => {
      console.log('disconnecting listener..')
      // listener.remove();
    }
  });

  return listener;
}

export default useTwitchPubSubClient;
