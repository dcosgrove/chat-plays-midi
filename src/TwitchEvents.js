import {
  useContext
} from 'react';

import { AuthContext } from './context/Auth';

import useTwitchPubSubClient from './hooks/TwitchPubSubClient';

function TwitchEvents() {
    const { clientId } = useContext(AuthContext);
    const devices = useTwitchPubSubClient(clientId);
    
    console.log('twitch events', devices);
    return <div>
      Hello world
    </div>
}

export default TwitchEvents;
