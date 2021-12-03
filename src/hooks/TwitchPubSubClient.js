import {
  useState,
  useEffect
} from 'react';

import { StaticAuthProvider } from '@twurple/auth';
import { SingleUserPubSubClient } from '@twurple/pubsub';

function useTwitchPubSubClient(clientId, token, onChannelPointRedemption) {
  const [ client,  setClient ] = useState(null);

  useEffect(() => {
    console.log('running effect in TwitchPubSubClient');
    if(!client && token !== '') {
      console.log('setting up pubsub client...');
      const authProvider = new StaticAuthProvider(clientId, token);
      console.log('auth provider', authProvider);
      
      const pubSubClient = new SingleUserPubSubClient({
        authProvider: authProvider
      });

      pubSubClient.onRedemption((message) => {
        // console.log('raw message', message);
        const { id, userDisplayName, rewardTitle, redemptionDate } = message;
        onChannelPointRedemption({ id, userDisplayName, rewardTitle, redemptionDate });
      }, (err) => {
        console.log('listening error', err);
      });

      setClient(pubSubClient);

    }

    return () => {
      console.log('pubsub effect teardown');
    }
  }, [client, clientId, onChannelPointRedemption, token]);

  return client;
}

export default useTwitchPubSubClient;
