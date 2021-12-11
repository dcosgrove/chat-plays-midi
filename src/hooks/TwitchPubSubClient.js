import {
  useState,
  useEffect
} from 'react';

import { StaticAuthProvider } from '@twurple/auth';
import { SingleUserPubSubClient } from '@twurple/pubsub';

const CONNECTION_STATUS_CHECK_PERIOD = 1000; // ms

const updateConnectedStatusLoop = (client, setConnectionStatus) => {
  setInterval(() => {
      const  { isConnected, isConnecting } = client._pubSubClient;
      setConnectionStatus(() => {
        return isConnected ? 'connected' : isConnecting ? 'connecting' : 'disconnected';
      });
  }, CONNECTION_STATUS_CHECK_PERIOD);
}

function useTwitchPubSubClient(clientId, token, onChannelPointRedemption) {
  const [ client,  setClient ] = useState(null);
  const [ connectionStatus, setConnectionStatus ] = useState('disconnected');

  useEffect(() => {
    if(!client && token !== '') {
      console.log('setting up Twitch pubsub client...');
      const authProvider = new StaticAuthProvider(clientId, token);      
      const pubSubClient = new SingleUserPubSubClient({
        authProvider: authProvider
      });

      setConnectionStatus('connecting');

      pubSubClient.onRedemption((message) => {
        const { id, userDisplayName, rewardTitle, redemptionDate } = message;
        onChannelPointRedemption({ id, userDisplayName, rewardTitle, redemptionDate });
      }, (err) => {
        throw(err);
      });

      setClient(pubSubClient);

      updateConnectedStatusLoop(pubSubClient, setConnectionStatus);
    }
  }, [client, clientId, onChannelPointRedemption, token]);

  return connectionStatus;
}

export default useTwitchPubSubClient;
